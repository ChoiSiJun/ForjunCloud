package forjun.web.module.user.application.port.in.dto;

/** 유저 정보 수정 명령 */  
public record ChangeUserInfoCommand(
    Long id,
    String userName,
    String email,
    String historyPrivate,
    String personalPrivate
) {
    
}
