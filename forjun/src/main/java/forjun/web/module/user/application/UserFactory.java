package forjun.web.module.user.application;

import forjun.web.module.user.application.port.in.dto.ChangeUserInfoCommand;
import forjun.web.module.user.application.port.in.dto.JoinUserCommand;
import forjun.web.module.user.domain.AuthorityStatus;
import forjun.web.module.user.domain.PrivateStatus;
import forjun.web.module.user.domain.User;

/** 유저 팩토리 */
public class UserFactory {


    /** 유저 도메인 생성 */
    public static User createUser(JoinUserCommand command) {
        return User.builder()
            .userId(command.userId())
            .userName(command.userName())
            .email(command.email())
            .password(command.password())
            .authority(AuthorityStatus.USER.name())
            .historyPrivate(PrivateStatus.PRIVATE.name())
            .personalPrivate(PrivateStatus.PRIVATE.name())
            .build();
    }

    /** 유저 정보 수정 도메인 생성 */
    public static User createUser(ChangeUserInfoCommand command) {
        return User.builder()
            .userId(command.userId())
            .userName(command.userName())
            .email(command.email())
            .historyPrivate(PrivateStatus.valueOf(command.historyPrivate()).name())
            .personalPrivate(PrivateStatus.valueOf(command.personalPrivate()).name())
            .build();
    }
}
