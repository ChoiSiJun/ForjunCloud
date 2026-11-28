package forjun.web.module.user.api;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import forjun.web.config.security.CustomUserDetail;
import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.module.user.application.port.in.UserUsecase;
import forjun.web.module.user.application.port.in.dto.ChangeUserPasswordCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserPrivacyCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserProfileCommand;
import forjun.web.module.user.domain.PrivateStatus;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Validator;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/user")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class UserSettingsApi {
    private static final int MAX_BODY_BYTES = 65_536;
    private final UserUsecase usecase;
    private final ObjectMapper mapper;
    private final Validator validator;

    private record ProfileRequest(@NotBlank @Size(max = 255) String userName,
                                  @NotBlank @Size(max = 255) @Email String email) {}

    @PatchMapping("/profile")
    public ResponseEntity<Void> profile(@AuthenticationPrincipal CustomUserDetail user, HttpServletRequest request) {
        long id = accountId(user);
        JsonNode body = readBody(request);
        var profile = new ProfileRequest(text(body, "userName"), text(body, "email"));
        if (!validator.validate(profile).isEmpty()) {
            throw invalid();
        }
        usecase.changeUserProfile(new ChangeUserProfileCommand(id, profile.userName(), profile.email()));
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/privacy")
    public ResponseEntity<Void> privacy(@AuthenticationPrincipal CustomUserDetail user, HttpServletRequest request) {
        long id = accountId(user);
        JsonNode body = readBody(request);
        usecase.changeUserPrivacy(new ChangeUserPrivacyCommand(id,
                visibility(body, "historyPrivate"), visibility(body, "personalPrivate")));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/password")
    public ResponseEntity<Void> password(@AuthenticationPrincipal CustomUserDetail user, HttpServletRequest request) {
        long id = accountId(user);
        JsonNode body = readBody(request);
        usecase.changeUserPassword(new ChangeUserPasswordCommand(id,
                text(body, "currentPassword"), text(body, "newPassword")));
        return ResponseEntity.noContent().build();
    }

    private JsonNode readBody(HttpServletRequest request) {
        try {
            byte[] bytes = request.getInputStream().readNBytes(MAX_BODY_BYTES + 1);
            if (bytes.length > MAX_BODY_BYTES) {
                throw invalid();
            }
            JsonNode body = mapper.reader().with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS,
                    DeserializationFeature.FAIL_ON_READING_DUP_TREE_KEY).readTree(bytes);
            if (body == null || !body.isObject()) {
                throw invalid();
            }
            return body;
        } catch (IOException ex) {
            throw invalid();
        }
    }

    private static long accountId(CustomUserDetail user) {
        if (user == null || user.getId() == null) {
            throw AppException.of(ErrorCode.AUTHENTICATION_FAILED);
        }
        return user.getId();
    }

    private static String text(JsonNode body, String name) {
        JsonNode value = body.path(name);
        if (!value.isTextual()) {
            throw invalid();
        }
        return value.textValue();
    }

    private static PrivateStatus visibility(JsonNode body, String name) {
        try {
            return PrivateStatus.valueOf(text(body, name));
        } catch (IllegalArgumentException ex) {
            throw invalid();
        }
    }

    private static AppException invalid() {
        return AppException.of(ErrorCode.VALIDATION_FAILED, "user settings request");
    }
}
