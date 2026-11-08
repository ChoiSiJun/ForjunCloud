package forjun.web.module.user.application.port.in.dto;

/** 유저 아이디 존재 여부 체크 명령 */
public record ExistUserCheckByUserIdQuery(
    String userId
) {

}
