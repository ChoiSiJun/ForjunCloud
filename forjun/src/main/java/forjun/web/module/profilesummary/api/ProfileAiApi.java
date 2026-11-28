package forjun.web.module.profilesummary.api;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import forjun.web.config.security.CustomUserDetail;
import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.module.profilesummary.application.ProfileAiDraft;
import forjun.web.module.profilesummary.application.ProfileAiService;
import forjun.web.module.profilesummary.application.ProfileAiService.SettingsView;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/profile-summary")
@RequiredArgsConstructor
public class ProfileAiApi {
    private static final int SETTINGS_BODY_LIMIT = 20_000;
    private static final int GENERATE_BODY_LIMIT = 620_000;

    private final ProfileAiService service;
    private final ObjectMapper mapper;

    @GetMapping("/ai-settings")
    public ResponseEntity<SettingsView> settings(@AuthenticationPrincipal CustomUserDetail user) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .body(service.getSettings(user.getId()));
    }

    @PutMapping("/ai-settings")
    public ResponseEntity<SettingsView> save(@AuthenticationPrincipal CustomUserDetail user,
                                              HttpServletRequest request) {
        JsonNode body = readBody(request, SETTINGS_BODY_LIMIT, ErrorCode.PROFILE_AI_SETTINGS_BODY_INVALID);
        String baseUrl = text(body, "baseUrl", ErrorCode.PROFILE_AI_SETTINGS_BODY_INVALID);
        String model = text(body, "model", ErrorCode.PROFILE_AI_SETTINGS_MODEL_INVALID);
        String apiKey = body.has("apiKey") ? text(body, "apiKey", ErrorCode.PROFILE_AI_SETTINGS_KEY_INVALID) : null;
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .body(service.saveSettings(user.getId(), baseUrl, model, apiKey));
    }

    @DeleteMapping("/ai-settings")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal CustomUserDetail user) {
        service.deleteSettings(user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/ai-settings/test")
    public ResponseEntity<Void> test(@AuthenticationPrincipal CustomUserDetail user, HttpServletRequest request) {
        try {
            if (request.getInputStream().read() != -1) {
                throw invalid();
            }
        } catch (IOException ex) {
            throw invalid();
        }
        service.test(user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/ai-generate")
    public ResponseEntity<ProfileAiDraft> generate(@AuthenticationPrincipal CustomUserDetail user,
                                                    HttpServletRequest request) {
        JsonNode body = readBody(request, GENERATE_BODY_LIMIT, ErrorCode.VALIDATION_FAILED);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .body(service.generate(user.getId(), text(body, "baseUrl", ErrorCode.VALIDATION_FAILED),
                        text(body, "prompt", ErrorCode.VALIDATION_FAILED),
                        body.hasNonNull("targetRole") ? text(body, "targetRole", ErrorCode.VALIDATION_FAILED) : null));
    }

    private JsonNode readBody(HttpServletRequest request, int limit, ErrorCode errorCode) {
        try {
            byte[] bytes = request.getInputStream().readNBytes(limit + 1);
            if (bytes.length > limit) {
                throw AppException.of(errorCode, "profile AI request");
            }
            JsonNode body = mapper.reader().with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS,
                    DeserializationFeature.FAIL_ON_READING_DUP_TREE_KEY).readTree(bytes);
            if (body == null || !body.isObject()) {
                throw AppException.of(errorCode, "profile AI request");
            }
            return body;
        } catch (IOException ex) {
            throw AppException.of(errorCode, "profile AI request");
        }
    }

    private static String text(JsonNode body, String field, ErrorCode errorCode) {
        JsonNode value = body.path(field);
        if (!value.isTextual()) {
            throw AppException.of(errorCode, "profile AI request");
        }
        return value.textValue();
    }

    private static AppException invalid() {
        return AppException.of(ErrorCode.VALIDATION_FAILED, "profile AI request");
    }
}
