package forjun.web.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // 유효성 검사
    VALIDATION_FAILED(
            "필수 입력값이 누락되었습니다.",
            "유효성 검사 실패 -> 원인:{}",
            "VALIDATION_FAILED",
            HttpStatus.BAD_REQUEST
    ),

    // 유저
    USER_NOT_FOUND(
            "존재하지 않는 이용자입니다.",
            "존재하지 않는 이용자입니다 -> ID:{}",
            "USER_NOT_FOUND",
            HttpStatus.NOT_FOUND
    ),
    USER_DUPLICATE(
            "이미 존재하는 이용자 입니다.",
            "이미 존재하는 이용자 입니다. -> ID:{}",
            "USER_DUPLICATE",
            HttpStatus.CONFLICT
    ),
    USER_NOT_MATCH_PASSWORD(
            "패스워드가 일치하지 않습니다",
            "패스워드 불일치 -> PW:{}",
            "NOT_MATCH_PASSWORD",
            HttpStatus.UNAUTHORIZED
    ),

    //히스토리
    HISTORY_NOT_FOUND(
            "히스토리가 존재하지 않습니다.",
            "히스토리 미존재 -> ID:{}",
            "HISTORY_NOT_FOUND",
            HttpStatus.NOT_FOUND
    ),

    //히스토리 접근 권한 없음
    HISTORY_NOT_ACCESS(
            "히스토리 접근 권한이 없습니다.",
            "히스토리 접근 권한 없음 -> ID:{}",
            "HISTORY_NOT_ACCESS",
            HttpStatus.FORBIDDEN
    ),

    //자기소개서
    PERSONAL_NOT_FOUND(
            "자기소개서가 존재하지 않습니다.",
            "자기소개서 미존재 -> ID:{}",
            "PERSONAL_NOT_FOUND",
            HttpStatus.NOT_FOUND
    ),

    //자기소개서 접근 권한 없음
    PERSONAL_NOT_ACCESS(
            "자기소개서 접근 권한이 없습니다.",
            "자기소개서 접근 권한 없음 -> ID:{}",
            "PERSONAL_NOT_ACCESS",
            HttpStatus.FORBIDDEN
    ),

    //인증 & 인가
    ID_NOT_FOUND(
            "아이디가 존재하지 않습니다.",
            "아이디 미존재 -> ID:{}",
            "ID_NOT_FOUND",
            HttpStatus.NOT_FOUND
    ),
    PASSWORD_NOT_MATCH(
            "비밀번호가 일치하지 않습니다.",
            "비밀번호 불일치 -> ID:{}",
            "PASSWORD_NOT_MATCH",
            HttpStatus.UNAUTHORIZED
    ),

    AUTHENTICATION_FAILED("인증에 실패하였습니다.", "AUTHENTICATION_FAILED", "AUTHENTICATION_FAILED",HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED("접근 권한이 없습니다.", "ACCESS_DENIED","ACCESS_DENIED", HttpStatus.FORBIDDEN),

    // JWT
    JWT_NOT_GENERATE(
            "토큰 생성을 실패하였습니다.",
            "토큰 생성 실패 -> 원인:{}",
            "JWT_NOT_GENERATE",
            HttpStatus.UNAUTHORIZED
    ),
    JWT_NOT_FOUND(
            "토큰이 존재하지 않습니다.",
            "토큰 미존재 -> 원인:{}",
            "JWT_NOT_FOUND",
            HttpStatus.NOT_FOUND
    ),
    JWT_EXPIRED(
            "토큰이 만료되었습니다.",
            "토큰 만료 -> 원인:{}",
            "JWT_EXPIRED",
            HttpStatus.UNAUTHORIZED
    ),

    // Upload
    INVALID_UPLOAD_PATH(
            "허용되지 않은 업로드 경로입니다.",
            "허용되지 않은 업로드 경로 요청",
            "INVALID_UPLOAD_PATH",
            HttpStatus.BAD_REQUEST
    ),

    FILE_NOT_FOUND(
            "파일이 없습니다.",
            "파일 미존재",
            "FILE_NOT_FOUND",
            HttpStatus.NOT_FOUND
    ),

    FILE_UPLOAD_FAIL(
            "파일 업로드에 실패하였습니다.",
            "파일 업로드 실패 -> 원인:{}",
            "FILE_UPLOAD_FAIL",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),

    FILE_DELETE_FAIL(
            "파일 삭제에 실패하였습니다.",
            "파일 삭제 실패 -> 원인:{}",
            "FILE_DELETE_FAIL",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),

    // SERVER
    SERVER_ERROR(
            "예상치 못한 서버 오류가 발생하였습니다.",
            "서버 오류 발생 -> 원인:{}",
            "SERVER_ERROR",
            HttpStatus.INTERNAL_SERVER_ERROR
    );

    private final String displayMessage; // 사용자에게 보여줄 메시지
    private final String logMessage;     // 로그용 메시지
    private final String code;           // 시스템 에러코드
    private final HttpStatus status;

    ErrorCode(String displayMessage, String logMessage, String code, HttpStatus status) {
        this.displayMessage = displayMessage;
        this.logMessage = logMessage;
        this.code = code;
        this.status = status;
    }
}
