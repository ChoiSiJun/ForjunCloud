package forjun.web.module.system.application.port.out;


import forjun.web.module.system.domain.UploadFile;

//File Database 영속성 포트
public interface FilePersistencePort {

    //파일 DB 저장
    public void save(UploadFile uploadFile);

    //파일 해쉬데이터 확인
    public UploadFile getFileByHashData(String hashData);

    //파일 정보 가져오기
    public UploadFile getFile(String fileId);
    
    //파일 DB 삭제
    public void delete(String fileId);

}
