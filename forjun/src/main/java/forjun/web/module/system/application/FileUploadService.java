package forjun.web.module.system.application;

import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.module.system.application.port.in.UploadUsecase;
import forjun.web.module.system.application.port.out.FilePersistencePort;
import forjun.web.module.system.application.port.out.FileStoragePort;
import forjun.web.module.system.application.port.out.InvalidUploadPathException;
import forjun.web.module.system.domain.UploadFile;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class FileUploadService implements UploadUsecase {

    private final FileStoragePort fileStoragePort;
    private final FilePersistencePort filePersistencePort;

    @Override
    public UploadFile uploadFile(MultipartFile multipartFile , String directory) {

        if (multipartFile == null || multipartFile.isEmpty() || Objects.requireNonNull(multipartFile.getOriginalFilename()).isEmpty()) {
            throw new AppException(ErrorCode.FILE_NOT_FOUND);
        }

        UploadFile uploadFile = null;

        try {
            //기존 파일 해쉬데이터 확인
            uploadFile = filePersistencePort.getFileByHashData(DigestUtils.sha256Hex(multipartFile.getInputStream() + directory));
            if(uploadFile != null) {
                return uploadFile;
            }

            // 1. 파일 시스템에 저장 (IO 작업)
            uploadFile = fileStoragePort.save(multipartFile , directory);

            // 2. 파일 메타데이터 DB 저장 (DB 트랜잭션 범위)
            filePersistencePort.save(uploadFile);

            return uploadFile;

        } catch (InvalidUploadPathException e) {
            throw new AppException(ErrorCode.INVALID_UPLOAD_PATH);
        }catch (Exception dbException) {

            // DB 저장이 실패하면, 물리적으로 저장된 파일도 삭제 (보상 트랜젝션)
            if (uploadFile != null) {
                try {
                    fileStoragePort.delete(uploadFile.getStoredPath());
                } catch (Exception deleteException) {
                    throw new AppException(ErrorCode.FILE_UPLOAD_FAIL, "DB 저장 실패 및 파일 시스템 롤백(삭제) 오류: " + deleteException.getMessage());
                }
            }
            throw new AppException(ErrorCode.FILE_UPLOAD_FAIL, "파일 메타데이터 DB 저장 오류: " + dbException.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileId) {

        UploadFile uploadFile = filePersistencePort.getFile(fileId);

        //파일 삭제 시작
        if (uploadFile != null) {
            try {
                fileStoragePort.delete(uploadFile.getStoredPath());
                filePersistencePort.delete(uploadFile.getFileId());
            } catch (Exception e) {
                throw new AppException(ErrorCode.FILE_DELETE_FAIL, e.getMessage());
            }
        }else{
            throw new AppException(ErrorCode.FILE_NOT_FOUND);
        }
    }
}
