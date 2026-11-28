package forjun.web.module.user.application;

import forjun.web.exception.AppException;
import forjun.web.module.user.application.port.in.dto.AuthenticationUserQuery;
import forjun.web.module.user.application.port.in.dto.ChangeUserInfoCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserPasswordCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserPrivacyCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserProfileCommand;
import forjun.web.module.user.application.port.out.UserJpaPort;
import forjun.web.module.user.domain.PrivateStatus;
import forjun.web.module.user.domain.User;
import forjun.web.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class UserSettingsServiceTest {
    private static final long ID = 42L;
    private static final String CURRENT = " legacy password ";
    private static final String NEW = "NewPassword!9";
    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder(4);

    private final UserJpaPort store = mock(UserJpaPort.class);
    private final JwtUtil jwt = mock(JwtUtil.class);
    private final UserService service = new UserService(store, jwt);

    @Test
    void writesBcryptWithCompareAndSetAndExistingLoginAcceptsOnlyNewPassword() {
        String oldHash = ENCODER.encode(CURRENT);
        when(store.findPasswordHash(ID)).thenReturn(Optional.of(oldHash));
        when(store.updatePasswordIfUnchanged(eq(ID), eq(oldHash), anyString())).thenReturn(1);

        service.changeUserPassword(new ChangeUserPasswordCommand(ID, CURRENT, NEW));

        var updated = ArgumentCaptor.forClass(String.class);
        verify(store).updatePasswordIfUnchanged(eq(ID), eq(oldHash), updated.capture());
        assertThat(ENCODER.matches(NEW, updated.getValue())).isTrue();
        assertThat(ENCODER.matches(CURRENT, updated.getValue())).isFalse();
        when(store.getUserByUserId("owner")).thenReturn(User.builder().userId("owner").userName("Name")
                .authority("USER").password(updated.getValue()).build());
        when(jwt.generateToken("owner", "Name", "USER")).thenReturn("token");
        assertThat(service.authentication(new AuthenticationUserQuery("owner", NEW))).isEqualTo("token");
        assertThatThrownBy(() -> service.authentication(new AuthenticationUserQuery("owner", CURRENT)))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "PASSWORD_NOT_MATCH");
    }

    @Test
    void wrongPasswordCannotWriteAndConflictCannotOverwriteAnotherPassword() {
        String oldHash = ENCODER.encode(CURRENT);
        when(store.findPasswordHash(ID)).thenReturn(Optional.of(oldHash));
        assertThatThrownBy(() -> service.changeUserPassword(new ChangeUserPasswordCommand(ID, CURRENT.strip(), NEW)))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "PASSWORD_NOT_MATCH");
        verify(store, never()).updatePasswordIfUnchanged(anyLong(), anyString(), anyString());

        assertThatThrownBy(() -> service.changeUserPassword(new ChangeUserPasswordCommand(ID, CURRENT, NEW)))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "PASSWORD_CHANGED");
        verify(store).updatePasswordIfUnchanged(eq(ID), eq(oldHash), anyString());
    }

    @Test
    void rejectsIdenticalPasswordsAndMeasuresBcryptLimitInUtf8Bytes() {
        String original = "A!1" + "가".repeat(23);
        String oldHash = ENCODER.encode(original);
        when(store.findPasswordHash(ID)).thenReturn(Optional.of(oldHash));
        assertThatThrownBy(() -> service.changeUserPassword(new ChangeUserPasswordCommand(ID, original, original + "가")))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "VALIDATION_FAILED");
        verifyNoInteractions(store);
        assertThatThrownBy(() -> service.changeUserPassword(new ChangeUserPasswordCommand(ID, original, original)))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "VALIDATION_FAILED");
        verify(store, never()).updatePasswordIfUnchanged(anyLong(), anyString(), anyString());

        when(store.updatePasswordIfUnchanged(eq(ID), eq(oldHash), anyString())).thenReturn(1);
        service.changeUserPassword(new ChangeUserPasswordCommand(ID, original + "legacy suffix",
                "B!2" + "나".repeat(23)));
        verify(store).updatePasswordIfUnchanged(eq(ID), eq(oldHash), anyString());
    }

    @Test
    void settingsAndLegacyPutEachUseTheirOwnFieldScopedWrite() {
        when(store.updateProfile(ID, "Name", "email@example.com")).thenReturn(1);
        when(store.updatePrivacy(ID, "PUBLIC", "PRIVATE")).thenReturn(1);
        when(store.updateMetadata(ID, "Old", "old@example.com", "PRIVATE", "PUBLIC")).thenReturn(1);

        service.changeUserProfile(new ChangeUserProfileCommand(ID, "Name", "email@example.com"));
        service.changeUserPrivacy(new ChangeUserPrivacyCommand(ID, PrivateStatus.PUBLIC, PrivateStatus.PRIVATE));
        service.changeUserInfo(new ChangeUserInfoCommand(ID, "Old", "old@example.com", "PRIVATE", "PUBLIC"));

        verify(store).updateProfile(ID, "Name", "email@example.com");
        verify(store).updatePrivacy(ID, "PUBLIC", "PRIVATE");
        verify(store).updateMetadata(ID, "Old", "old@example.com", "PRIVATE", "PUBLIC");
        verifyNoMoreInteractions(store);
    }
}
