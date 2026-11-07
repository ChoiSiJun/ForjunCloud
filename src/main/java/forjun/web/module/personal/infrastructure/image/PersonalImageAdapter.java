package forjun.web.module.personal.infrastructure.image;

import forjun.web.module.personal.application.port.out.PersonalImagePort;
import forjun.web.module.system.application.port.in.FileQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PersonalImageAdapter implements PersonalImagePort {
    private final FileQuery fileQuery;

    @Override
    public Optional<ImageInfo> findImage(String fileId) {
        return fileQuery.findFile(fileId)
                .map(file -> new ImageInfo(file.fileId(), file.url()));
    }
}
