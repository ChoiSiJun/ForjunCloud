package forjun.web.module.personal.application;

import forjun.web.exception.AppException;
import forjun.web.module.personal.application.port.in.dto.*;
import forjun.web.module.personal.application.port.out.*;
import forjun.web.module.personal.domain.Personal;
import forjun.web.module.personal.api.mapper.PersonalApiMapper;
import forjun.web.module.personal.infrastructure.image.PersonalImageAdapter;
import forjun.web.module.system.application.port.in.FileQuery;
import forjun.web.module.user.application.port.in.UserQuery;
import forjun.web.module.user.domain.User;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class PersonalImageTest {
    final PersonalJpaPort persistence = mock(PersonalJpaPort.class);
    final PersonalImagePort images = mock(PersonalImagePort.class);
    final UserQuery users = mock(UserQuery.class);
    final PersonalService service = new PersonalService(persistence, images, users);

    void givenPersonal(String fileId) {
        when(persistence.getPersonal("owner")).thenReturn(Optional.of(
                Personal.builder().userId("owner").profile_image_id(fileId).build()));
    }

    @Test void resolvesImageAndExposesIdAndUrl() {
        givenPersonal("file-1");
        when(images.findImage("file-1")).thenReturn(Optional.of(
                new PersonalImagePort.ImageInfo("file-1", "/files/profile/a.png", "owner")));
        var response = new PersonalApiMapper().toPersonalResponseDto(
                service.getPersonal(new GetPersonalQuery("owner")));
        assertThat(response.profileImageId()).isEqualTo("file-1");
        assertThat(response.profileImageUrl()).isEqualTo("/files/profile/a.png");
    }

    @Test void absentImageDoesNotCallUploadModule() {
        givenPersonal(null);
        assertThat(service.getPersonal(new GetPersonalQuery("owner")).profileImageUrl()).isNull();
        verifyNoInteractions(images);
    }

    @Test void deletedFileReturnsNullUrl() {
        givenPersonal("deleted");
        when(images.findImage("deleted")).thenReturn(Optional.empty());
        assertThat(service.getPersonal(new GetPersonalQuery("owner")).profileImageUrl()).isNull();
    }

    @Test void infrastructureFailureIsNotTreatedAsMissingImage() {
        givenPersonal("file-1");
        when(images.findImage("file-1")).thenThrow(new IllegalStateException("unavailable"));
        assertThatThrownBy(() -> service.getPersonal(new GetPersonalQuery("owner")))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test void publicPersonalAlsoResolvesImage() {
        givenPersonal("file-1");
        when(users.getUserByUserId(any())).thenReturn(User.builder().personalPrivate("PUBLIC").build());
        when(images.findImage("file-1")).thenReturn(Optional.of(new PersonalImagePort.ImageInfo("file-1", "/image", "owner")));
        assertThat(service.getPublicPersonal(new GetPublicPersonalQuery("owner")).profileImageUrl()).isEqualTo("/image");
    }

    @Test void privatePersonalDoesNotResolveImage() {
        when(users.getUserByUserId(any())).thenReturn(User.builder().personalPrivate("PRIVATE").build());
        assertThatThrownBy(() -> service.getPublicPersonal(new GetPublicPersonalQuery("owner")))
                .isInstanceOf(AppException.class);
        verifyNoInteractions(images, persistence);
    }

    @Test void saveRejectsUnknownFile() {
        when(images.findImage("missing")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.savePersonal(command("missing")))
                .isInstanceOf(AppException.class)
                .satisfies(error -> assertThat(((AppException) error).getErrorCode()).isEqualTo("FILE_NOT_FOUND"));
        verifyNoInteractions(persistence);
    }

    @Test void savePersistsFileId() {
        when(images.findImage("file-1")).thenReturn(Optional.of(new PersonalImagePort.ImageInfo("file-1", "/image", "owner")));
        service.savePersonal(command("file-1"));
        verify(persistence).savePersonal(argThat(p -> "file-1".equals(p.getProfile_image_id())));
    }

    @Test void saveRejectsAnotherUsersFile() {
        when(images.findImage("file-1")).thenReturn(Optional.of(
                new PersonalImagePort.ImageInfo("file-1", "/image", "other")));
        assertThatThrownBy(() -> service.savePersonal(command("file-1")))
                .isInstanceOf(AppException.class)
                .satisfies(error -> assertThat(((AppException) error).getErrorCode()).isEqualTo("ACCESS_DENIED"));
        verifyNoInteractions(persistence);
    }

    @Test void legacyFileCanOnlyRemainOnItsExistingProfile() {
        when(images.findImage("legacy")).thenReturn(Optional.of(
                new PersonalImagePort.ImageInfo("legacy", "/image", null)));
        givenPersonal("different-file");
        assertThatThrownBy(() -> service.savePersonal(command("legacy")))
                .isInstanceOf(AppException.class);
        verify(persistence, never()).savePersonal(any());

        givenPersonal("legacy");
        service.savePersonal(command("legacy"));
        verify(persistence).savePersonal(argThat(personal -> "legacy".equals(personal.getProfile_image_id())));
    }

    @Test void adapterMapsUploadContractToPersonalContract() {
        FileQuery query = mock(FileQuery.class);
        when(query.findFile("file-1")).thenReturn(Optional.of(new FileQuery.FileInfo("file-1", "/image", "owner")));
        assertThat(new PersonalImageAdapter(query).findImage("file-1"))
                .contains(new PersonalImagePort.ImageInfo("file-1", "/image", "owner"));
    }

    SavePersonalCommand command(String id) {
        return new SavePersonalCommand("owner", "job", "name", "education", "4", "intro", id,
                List.of(), List.of(), List.of(), List.of());
    }
}
