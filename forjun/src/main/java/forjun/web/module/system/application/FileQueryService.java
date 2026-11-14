package forjun.web.module.system.application;

import forjun.web.module.system.application.port.in.FileQuery;
import forjun.web.module.system.application.port.out.FilePersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FileQueryService implements FileQuery {
    private final FilePersistencePort persistence;

    @Value("${file.upload.resource-domain}")
    private String resourceDomain;
    @Value("${file.upload.resource-url}")
    private String resourceUrl;

    @Override
    public Optional<FileInfo> findFile(String fileId) {
        return Optional.ofNullable(persistence.getFile(fileId))
                .map(file -> new FileInfo(file.getFileId(),
                        resourceDomain + resourceUrl + file.getUrl(), file.getOwnerId()));
    }
}
