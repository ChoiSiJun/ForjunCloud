package forjun.web.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class AppException extends RuntimeException {

    /** 에러 코드 */
    private final ErrorCode errorCode;

    /** 로그 메시지 대입값 */
    @Getter
    private final transient Object[] logArgs; 

    public AppException(ErrorCode errorCode, Object... logArgs) {
        super(errorCode.getDisplayMessage()); // 사용자 메시지만 super에 전달
        this.errorCode = errorCode;
        this.logArgs = logArgs;
    }

    public String getDisplayMessage() {
        return errorCode.getDisplayMessage();
    }

    public String getLogMessage() {
        return errorCode.getLogMessage();
    }

    public String getErrorCode() {
        return errorCode.getCode();
    }

    public HttpStatus getHttpStatus() {
        return errorCode.getStatus();
    }

    public static AppException of(ErrorCode errorCode, Object... logArgs) {
        return new AppException(errorCode , logArgs);
    }

}
