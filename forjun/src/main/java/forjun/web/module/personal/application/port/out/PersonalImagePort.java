package forjun.web.module.personal.application.port.out;

import java.util.Optional;

public interface PersonalImagePort {
    /** 파일이 없을 때만 empty. 저장소/통신 장애는 예외로 전달한다. */
    Optional<ImageInfo> findImage(String fileId);

    record ImageInfo(String fileId, String url, String ownerId) {}
}
