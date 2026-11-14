package forjun.web.module.system.application.port.in;

import java.util.Optional;

public interface FileQuery {
    Optional<FileInfo> findFile(String fileId);

    record FileInfo(String fileId, String url, String ownerId) {}
}
