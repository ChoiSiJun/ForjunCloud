package forjun.web.module.user.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import forjun.web.config.security.CustomUserDetail;
import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.exception.GlobalExceptionHandler;
import forjun.web.module.user.api.mapper.UserApiMapper;
import forjun.web.module.user.application.port.in.UserQuery;
import forjun.web.module.user.application.port.in.UserUsecase;
import forjun.web.module.user.application.port.in.dto.ChangeUserInfoCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserPasswordCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserPrivacyCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserProfileCommand;
import forjun.web.module.user.application.port.in.dto.GetUserInfoByUserIdQuery;
import forjun.web.module.user.domain.PrivateStatus;
import forjun.web.module.user.domain.User;
import jakarta.validation.Validation;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserSettingsApiTest {
    private static final String BASE = "/api/v1/user";
    private static final long ID = 42L;
    private static final ValidatorFactory VALIDATOR_FACTORY = Validation.buildDefaultValidatorFactory();
    private final UserUsecase usecase = mock(UserUsecase.class);
    private final UserQuery query = mock(UserQuery.class);
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(
                    new UserSettingsApi(usecase, new ObjectMapper(), VALIDATOR_FACTORY.getValidator()),
                    new UserApi(query, usecase, Mappers.getMapper(UserApiMapper.class)))
            .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();

    @AfterEach
    void clearAuthentication() {
        SecurityContextHolder.clearContext();
    }

    @AfterAll
    static void closeValidator() {
        VALIDATOR_FACTORY.close();
    }

    @Test
    void anonymousRequestCannotReachUsecase() throws Exception {
        mvc.perform(patch(BASE + "/profile").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userName\":\"Name\",\"email\":\"email@example.com\"}"))
                .andExpect(status().isUnauthorized());
        verifyNoInteractions(usecase);
    }

    @Test
    void authenticatedSettingsUsePrincipalIdAndReturnNoContent() throws Exception {
        authenticate();
        mvc.perform(patch(BASE + "/profile").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":99,\"userName\":\"Name\",\"email\":\"email@example.com\"}"))
                .andExpect(status().isNoContent()).andExpect(content().string(""));
        mvc.perform(patch(BASE + "/privacy").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"historyPrivate\":\"PUBLIC\",\"personalPrivate\":\"PRIVATE\"}"))
                .andExpect(status().isNoContent()).andExpect(content().string(""));
        mvc.perform(put(BASE + "/password").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\" current \",\"newPassword\":\"NewPassword!9\"}"))
                .andExpect(status().isNoContent()).andExpect(content().string(""));
        verify(usecase).changeUserProfile(new ChangeUserProfileCommand(ID, "Name", "email@example.com"));
        verify(usecase).changeUserPrivacy(new ChangeUserPrivacyCommand(ID, PrivateStatus.PUBLIC, PrivateStatus.PRIVATE));
        verify(usecase).changeUserPassword(new ChangeUserPasswordCommand(ID, " current ", "NewPassword!9"));
    }

    @Test
    void validatesFieldsAndKeepsMalformedPasswordBodyOutOfError() throws Exception {
        authenticate();
        mvc.perform(patch(BASE + "/profile").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userName\":\"Name\",\"email\":\"invalid\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
        mvc.perform(patch(BASE + "/profile").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userName\":123,\"email\":\"email@example.com\"}"))
                .andExpect(status().isBadRequest());
        mvc.perform(patch(BASE + "/privacy").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"historyPrivate\":\"public\",\"personalPrivate\":\"PRIVATE\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
        mvc.perform(put(BASE + "/password").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\"private-body\",\"newPassword\":"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(content().string(not(containsString("private-body"))));
        verifyNoInteractions(usecase);
    }

    @Test
    void retainsLegacyGetAndPutAndReturnsPasswordMismatchCode() throws Exception {
        authenticate();
        when(query.getUserByUserId(new GetUserInfoByUserIdQuery("owner")))
                .thenReturn(User.builder().userId("owner").userName("Old Name").email("email@example.com")
                        .password("stored-hash").historyPrivate("PRIVATE").build());
        mvc.perform(get(BASE)).andExpect(status().isOk())
                .andExpect(jsonPath("$.userName").value("Old Name"))
                .andExpect(jsonPath("$.historyPrivate").value("PRIVATE"))
                .andExpect(jsonPath("$.password").doesNotExist());
        mvc.perform(put(BASE).contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"userName":"Name","email":"email@example.com",
                                 "historyPrivate":"PUBLIC","personalPrivate":"PRIVATE"}
                                """))
                .andExpect(status().isOk()).andExpect(content().string(""));
        verify(usecase).changeUserInfo(new ChangeUserInfoCommand(ID, "Name", "email@example.com", "PUBLIC", "PRIVATE"));

        doThrow(AppException.of(ErrorCode.PASSWORD_NOT_MATCH, ID)).when(usecase)
                .changeUserPassword(any(ChangeUserPasswordCommand.class));
        mvc.perform(put(BASE + "/password").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\"wrong\",\"newPassword\":\"NewPassword!9\"}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("PASSWORD_NOT_MATCH"));
        doThrow(AppException.of(ErrorCode.PASSWORD_CHANGED)).when(usecase)
                .changeUserPassword(any(ChangeUserPasswordCommand.class));
        mvc.perform(put(BASE + "/password").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\"current\",\"newPassword\":\"NewPassword!9\"}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("PASSWORD_CHANGED"));
    }

    private void authenticate() {
        var user = CustomUserDetail.builder().id(ID).userId("owner").build();
        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated(user, null, List.of()));
    }
}
