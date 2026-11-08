package forjun.web.module.system.infrastructure.persistence;

import forjun.web.module.system.application.port.out.FilePersistencePort;
import forjun.web.module.system.domain.UploadFile;
import forjun.web.module.system.infrastructure.persistence.entity.UploadFileEntity;
import forjun.web.module.system.infrastructure.persistence.mapper.FileEntityMapper;
import forjun.web.module.system.infrastructure.persistence.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class FileJpaAdapter implements FilePersistencePort {

    private final FileRepository fileRepository;

    private final FileEntityMapper fileEntityMapper;

    @Override
    public void save(UploadFile uploadFile) {
        UploadFileEntity uploadFileEntity = fileEntityMapper.toEntity(uploadFile);
        fileRepository.save(uploadFileEntity);
    }

    @Override
    public UploadFile getFileByHashData(String hashData) {
        return fileEntityMapper.toDomain(fileRepository.findByHashData(hashData));
    }

    @Override
    public UploadFile getFile(String fileId) {
        return fileEntityMapper.toDomain(fileRepository.findByFileId(fileId));
    }

    @Override
    public void delete(String fileId) {
        fileRepository.deleteByFileId(fileId);
    }
}
