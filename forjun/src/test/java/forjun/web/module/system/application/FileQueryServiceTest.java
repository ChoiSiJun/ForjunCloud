package forjun.web.module.system.application;

import forjun.web.module.system.application.port.out.FilePersistencePort;
import forjun.web.module.system.domain.UploadFile;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class FileQueryServiceTest {
    @Test void resolvesMetadataIntoPublicUrlAndHandlesMissingFile() {
        var persistence = mock(FilePersistencePort.class);
        var service = new FileQueryService(persistence);
        ReflectionTestUtils.setField(service, "resourceDomain", "https://example.test");
        ReflectionTestUtils.setField(service, "resourceUrl", "/api/files/download/");
        when(persistence.getFile("file-1")).thenReturn(UploadFile.builder()
                .fileId("file-1").url("profile/a.png").build());

        assertThat(service.findFile("file-1").orElseThrow().url())
                .isEqualTo("https://example.test/api/files/download/profile/a.png");
        assertThat(service.findFile("missing")).isEmpty();
    }
}
