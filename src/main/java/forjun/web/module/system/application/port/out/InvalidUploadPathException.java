package forjun.web.module.system.application.port.out;

/** 저장소가 요청한 업로드 경로를 허용하지 않는 경우 */
public class InvalidUploadPathException extends RuntimeException {
    public InvalidUploadPathException() {
        super("허용되지 않은 업로드 경로입니다.");
    }
}
