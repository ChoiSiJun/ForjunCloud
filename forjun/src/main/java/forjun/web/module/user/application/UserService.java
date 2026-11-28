package forjun.web.module.user.application;

import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.module.user.application.port.in.UserQuery;
import forjun.web.module.user.application.port.in.UserUsecase;
import forjun.web.module.user.application.port.in.dto.AuthenticationUserQuery;
import forjun.web.module.user.application.port.in.dto.ChangeUserInfoCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserPasswordCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserPrivacyCommand;
import forjun.web.module.user.application.port.in.dto.ChangeUserProfileCommand;
import forjun.web.module.user.application.port.in.dto.DeleteUserCommand;
import forjun.web.module.user.application.port.in.dto.ExistUserCheckByUserIdQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoByUserIdQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoQuery;
import forjun.web.module.user.application.port.in.dto.JoinUserCommand;
import forjun.web.module.user.application.port.out.UserJpaPort;
import forjun.web.module.user.domain.User;
import forjun.web.module.user.domain.UserPasswordPolicy;
import forjun.web.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService implements UserQuery, UserUsecase {

    private final UserJpaPort userJpaPort;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    //유저 저장
    @Override
    public void joinUser(JoinUserCommand command){

        //패스워드 암호화.
        User user = UserFactory.createUser(command);
        user.decryptPassword();

        //기존 가입정보 있는지 확인.
        if(userJpaPort.existsByUserId(user.getUserId())){
            throw AppException.of(ErrorCode.USER_DUPLICATE, user.getUserId());
        }

        //유저 저장
        userJpaPort.saveUser(user);
    }

    @Override
    public void withdrawUser(DeleteUserCommand command) {

        //기존 가입정보 있는지 확인.
        if(!userJpaPort.existsById(command.id())){
            throw AppException.of(ErrorCode.USER_NOT_FOUND, command.id());
        }

        //유저 삭제
        userJpaPort.deleteUser(command.id());
    }

    @Override
    public void changeUserInfo(ChangeUserInfoCommand command) {
        requireUpdated(userJpaPort.updateMetadata(command.id(), command.userName(), command.email(),
                command.historyPrivate(), command.personalPrivate()), command.id());
    }

    @Override
    public void changeUserProfile(ChangeUserProfileCommand command) {
        requireUpdated(userJpaPort.updateProfile(command.id(), command.userName(), command.email()), command.id());
    }

    @Override
    public void changeUserPrivacy(ChangeUserPrivacyCommand command) {
        requireUpdated(userJpaPort.updatePrivacy(command.id(), command.historyPrivate().name(),
                command.personalPrivate().name()), command.id());
    }

    @Override
    public void changeUserPassword(ChangeUserPasswordCommand command) {
        if (command.currentPassword() == null || command.currentPassword().isEmpty()
                || !UserPasswordPolicy.acceptsNewPassword(command.newPassword())) {
            throw AppException.of(ErrorCode.VALIDATION_FAILED, "user password change");
        }
        String oldHash = userJpaPort.findPasswordHash(command.id())
                .orElseThrow(() -> AppException.of(ErrorCode.USER_NOT_FOUND, command.id()));
        if (!passwordEncoder.matches(command.currentPassword(), oldHash)) {
            throw AppException.of(ErrorCode.PASSWORD_NOT_MATCH, command.id());
        }
        if (passwordEncoder.matches(command.newPassword(), oldHash)) {
            throw AppException.of(ErrorCode.VALIDATION_FAILED, "new password matches current password");
        }
        String newHash = passwordEncoder.encode(command.newPassword());
        if (userJpaPort.updatePasswordIfUnchanged(command.id(), oldHash, newHash) != 1) {
            throw AppException.of(ErrorCode.PASSWORD_CHANGED);
        }
    }

    private static void requireUpdated(int count, long id) {
        if (count != 1) {
            throw AppException.of(ErrorCode.USER_NOT_FOUND, id);
        }
    }

    @Override
    public User getUser(GetUserInfoQuery query) {

        //기존 가입정보 있는지 확인.
        User user = userJpaPort.getUser(query.id());
        if(user == null){
            throw AppException.of(ErrorCode.USER_NOT_FOUND, query.id());
        }
        
        //유저 정보 조회
        return userJpaPort.getUser(query.id());
    }

    @Override
    public User getUserByUserId(GetUserInfoByUserIdQuery query) {

        //유저 정보 조회
        User user = userJpaPort.getUserByUserId(query.userId());

        //유저 정보 없는 경우 예외 발생
        if(user == null){
            throw AppException.of(ErrorCode.USER_NOT_FOUND, query.userId());
        }
    
        return user;
    }

    @Override
    public String authentication(AuthenticationUserQuery query) {

 
        //유저 정보 조회
        User user = userJpaPort.getUserByUserId(query.userId());
        if (user == null) {
            throw AppException.of(ErrorCode.USER_NOT_FOUND, query.userId());
        }

        if(!passwordEncoder.matches(query.password(), user.getPassword())){
            throw AppException.of(ErrorCode.PASSWORD_NOT_MATCH, query.userId());
        }
        
        return jwtUtil.generateToken(user.getUserId() , user.getUserName() , user.getAuthority());
    }

    @Override
    public boolean existsByUserId(ExistUserCheckByUserIdQuery query) {
        return userJpaPort.existsByUserId(query.userId());
    }
}
