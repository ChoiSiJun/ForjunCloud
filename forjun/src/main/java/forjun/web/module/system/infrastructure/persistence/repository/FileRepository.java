package forjun.web.module.system.infrastructure.persistence.repository;

import forjun.web.module.system.infrastructure.persistence.entity.UploadFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<UploadFileEntity, Integer> {

    //파일 ID로 파일정보 가져오기
    public UploadFileEntity findByFileId(String fileId);

    //파일 해쉬데이터 확인
    public UploadFileEntity findByHashData(String hashData);
    
    //파일 ID로 메타데이터 삭제.
    public void deleteByFileId(String fileName);
}
