package forjun.web.module.user.application;

import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.module.user.application.port.in.UserQuery;
import forjun.web.module.user.application.port.in.UserUsecase;
import forjun.web.module.user.application.port.in.dto.AuthenticationUserQuery;
import forjun.web.module.user.application.port.in.dto.ChangeUserInfoCommand;
import forjun.web.module.user.application.port.in.dto.DeleteUserCommand;
import forjun.web.module.user.application.port.in.dto.ExistUserCheckByUserIdQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoByUserIdQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoQuery;
import forjun.web.module.user.application.port.in.dto.JoinUserCommand;
import forjun.web.module.user.application.port.out.UserJpaPort;
import forjun.web.module.user.domain.User;
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

        //기존 가입정보 있는지 확인 (userId로 조회)
        User existingUser = userJpaPort.getUserByUserId(command.userId());
        if(existingUser == null){
            throw AppException.of(ErrorCode.USER_NOT_FOUND, command.userId());
        }

        //기존 정보를 유지하면서 수정할 필드만 업데이트
        User updatedUser = User.builder()
                .id(existingUser.getId())
                .userId(existingUser.getUserId())
                .password(existingUser.getPassword())
                .userName(command.userName())
                .email(command.email())
                .authority(existingUser.getAuthority())
                .historyPrivate(command.historyPrivate())
                .personalPrivate(command.personalPrivate())
                .build();

        //유저 정보 수정
        userJpaPort.saveUser(updatedUser);
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

        //패스워드 일치 체크
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


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
