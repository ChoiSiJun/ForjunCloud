package forjun.web.module.system.application;

import forjun.web.exception.AppException;
import forjun.web.module.system.application.port.out.FilePersistencePort;
import forjun.web.module.system.domain.UploadFile;
import forjun.web.module.system.infrastructure.storage.LocalFileStorageAdapter;
import org.apache.commons.codec.digest.DigestUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class FileUploadServiceTest {
    @TempDir Path uploadRoot;
    private final FilePersistencePort persistence = mock(FilePersistencePort.class);

    @Test void identicalUploadsHaveTheSameContentHashButIndependentOwnersAndFiles() {
        var service = new FileUploadService(new LocalFileStorageAdapter(uploadRoot.toString()), persistence);
        byte[] content = {1, 2, 3};
        var file = new MockMultipartFile("file", "image.png", "image/png", content);

        UploadFile first = service.uploadFile(file, "profile", "first");
        UploadFile second = service.uploadFile(file, "profile", "second");
        assertThat(first.getHashData()).isEqualTo(DigestUtils.sha256Hex(content));
        assertThat(second.getHashData()).isEqualTo(first.getHashData());
        assertThat(second.getFileId()).isNotEqualTo(first.getFileId());
        assertThat(first.getOwnerId()).isEqualTo("first");
        assertThat(second.getOwnerId()).isEqualTo("second");
        verify(persistence).save(first);
        verify(persistence).save(second);

        when(persistence.getFile(first.getFileId())).thenReturn(first);
        assertThatThrownBy(() -> service.deleteFile(first.getFileId(), "second"))
                .isInstanceOf(AppException.class)
                .satisfies(error -> assertThat(((AppException) error).getErrorCode()).isEqualTo("ACCESS_DENIED"));
        assertThat(Files.exists(Path.of(first.getStoredPath()))).isTrue();
        verify(persistence, never()).delete(anyString());

        service.deleteFile(first.getFileId(), "first");
        assertThat(Files.exists(Path.of(first.getStoredPath()))).isFalse();
        assertThat(Files.exists(Path.of(second.getStoredPath()))).isTrue();
        verify(persistence).delete(first.getFileId());
    }

    @Test void legacyFileWithoutAnOwnerCannotBeDeletedByAUser() {
        var service = new FileUploadService(new LocalFileStorageAdapter(uploadRoot.toString()), persistence);
        when(persistence.getFile("legacy")).thenReturn(UploadFile.builder().fileId("legacy").build());
        assertThatThrownBy(() -> service.deleteFile("legacy", "user"))
                .isInstanceOf(AppException.class)
                .satisfies(error -> assertThat(((AppException) error).getErrorCode()).isEqualTo("ACCESS_DENIED"));
        verify(persistence, never()).delete(anyString());
    }
}
