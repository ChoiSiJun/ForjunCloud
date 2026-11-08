package forjun.web.module.user.application.port.in.dto;

/** 유저 회원가입 명령 */
public record JoinUserCommand(
    String userId,
    String userName,
    String password,
    String email
) {
    
}
