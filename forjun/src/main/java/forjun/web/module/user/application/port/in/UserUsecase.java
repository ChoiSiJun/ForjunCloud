package forjun.web.module.user.application.port.in;

import forjun.web.module.user.application.port.in.dto.ChangeUserInfoCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserPasswordCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserPrivacyCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserProfileCommand;
import forjun.web.module.user.application.port.in.dto.DeleteUserCommand;
import forjun.web.module.user.application.port.in.dto.JoinUserCommand;

public interface UserUsecase {

    //유저 회원가입
    public void joinUser(JoinUserCommand command);

    //유저 삭제
    public void withdrawUser(DeleteUserCommand id);

    //유저 수정
    public void changeUserInfo(ChangeUserInfoCommand command);

    void changeUserProfile(ChangeUserProfileCommand command);

    void changeUserPrivacy(ChangeUserPrivacyCommand command);

    void changeUserPassword(ChangeUserPasswordCommand command);
}
