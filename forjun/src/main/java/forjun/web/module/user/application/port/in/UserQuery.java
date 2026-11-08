package forjun.web.module.user.application.port.in;
import forjun.web.module.user.application.port.in.dto.AuthenticationUserQuery;
import forjun.web.module.user.application.port.in.dto.ExistUserCheckByUserIdQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoByUserIdQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoQuery;
import forjun.web.module.user.domain.User;

public interface UserQuery {

    /** 유저 정보 조회 */
    User getUser(GetUserInfoQuery query);

    /** 유저 정보 조회 */   
    User getUserByUserId(GetUserInfoByUserIdQuery query);

    /** 유저 인증 */
    String authentication(AuthenticationUserQuery query);

    /** 유저 아이디 존재 여부 체크 true = 존재함 or false = 존재하지 않음 */
    boolean existsByUserId(ExistUserCheckByUserIdQuery query);
}
