package forjun.web.module.system.application.port.out;

import forjun.web.module.system.domain.UploadFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStoragePort {

    //파일 업로드
    UploadFile save(MultipartFile file , String directory) throws IOException;

    //파일 삭제
    void delete(String storedPath);
}
