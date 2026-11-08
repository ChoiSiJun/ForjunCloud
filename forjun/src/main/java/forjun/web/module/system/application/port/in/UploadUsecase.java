package forjun.web.module.system.application.port.in;

import forjun.web.module.system.domain.UploadFile;
import org.springframework.web.multipart.MultipartFile;

public interface UploadUsecase {
    
    //파일 업로드 서비스
    public UploadFile uploadFile(MultipartFile multipartFile , String directory);

    public void deleteFile(String fileId);
}
