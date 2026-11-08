package forjun.web.module.user.api.dto;

/** 유저 정보 응답 DTO */
public record UserInfoResponse(
    String userId,
    String userName,
    String email,
    String authority,
    String historyPrivate,
    String personalPrivate
) {
} 


