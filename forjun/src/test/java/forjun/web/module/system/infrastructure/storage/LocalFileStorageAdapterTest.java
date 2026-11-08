package forjun.web.module.system.infrastructure.storage;

import forjun.web.exception.AppException;
import forjun.web.module.system.application.FileUploadService;
import forjun.web.module.system.application.port.out.FilePersistencePort;
import forjun.web.module.system.application.port.out.InvalidUploadPathException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LocalFileStorageAdapterTest {
    @TempDir
    Path temp;

    private MockMultipartFile file() {
        return new MockMultipartFile("file", "photo.png", "image/png", new byte[]{1, 2, 3});
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "profile", "history/images", "프로필"})
    void storesAllowedRelativeDirectories(String directory) throws Exception {
        Path root = temp.resolve("uploads");
        var adapter = new LocalFileStorageAdapter(root.toString());

        var saved = adapter.save(file(), directory);

        Path path = Path.of(saved.getStoredPath());
        assertThat(path.startsWith(root)).isTrue();
        assertThat(Files.readAllBytes(path)).containsExactly(1, 2, 3);
        assertThat(saved.getUrl()).doesNotContain("\\", "..");
    }

    @ParameterizedTest
    @ValueSource(strings = {"..", "../outside", "profile/../../outside", "/tmp/outside",
            "C:/outside", "C:outside", "..\\outside", "\\\\server\\share", "profile/../etc"})
    void rejectsUnsafeDirectoriesBeforeWriting(String directory) throws Exception {
        Path root = temp.resolve("uploads");
        var adapter = new LocalFileStorageAdapter(root.toString());

        assertThrows(InvalidUploadPathException.class, () -> adapter.save(file(), directory));

        try (var entries = Files.list(root)) {
            assertThat(entries.count()).isZero();
        }
    }

    @Test
    void rejectsPathSeparatorsInExtension() {
        var adapter = new LocalFileStorageAdapter(temp.resolve("uploads").toString());
        var malicious = new MockMultipartFile("file", "photo.png/child", "image/png", new byte[]{1});

        assertThrows(InvalidUploadPathException.class, () -> adapter.save(malicious, "profile"));
    }

    @Test
    void serviceReportsInvalidPathAsBadRequestWithoutSavingMetadata() {
        var persistence = mock(FilePersistencePort.class);
        var adapter = new LocalFileStorageAdapter(temp.resolve("uploads").toString());
        var service = new FileUploadService(adapter, persistence);

        AppException error = assertThrows(AppException.class,
                () -> service.uploadFile(file(), "../outside"));

        assertThat(error.getHttpStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(error.getErrorCode()).isEqualTo("INVALID_UPLOAD_PATH");
        verify(persistence, never()).save(any());
    }
}
