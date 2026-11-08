package forjun.web.module.user.application.port.in.dto;

public record AuthenticationUserQuery(
    String userId,
    String password
) {
    
}
