package forjun.web.module.user.api.mapper;

import forjun.web.module.user.api.dto.UpdateUserInfoRequest;
import forjun.web.module.user.api.dto.UserInfoResponse;
import forjun.web.module.user.api.dto.UserJoinRequest;
import forjun.web.module.user.api.dto.UserLoginRequest;
import forjun.web.module.user.application.port.in.dto.AuthenticationUserQuery;
import forjun.web.module.user.application.port.in.dto.ChangeUserInfoCommand;
import forjun.web.module.user.application.port.in.dto.ExistUserCheckByUserIdQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoByUserIdQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoQuery;
import forjun.web.module.user.application.port.in.dto.JoinUserCommand;
import forjun.web.module.user.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface UserApiMapper {

    //유저 회원가입
    JoinUserCommand toUserJoinCommand(UserJoinRequest request);

    //유저 인증
    AuthenticationUserQuery toAuthenticationUserQuery(UserLoginRequest request);

    //유저 아이디 존재 여부 체크 
    @Mapping(target = "userId", source = "userId")
    ExistUserCheckByUserIdQuery toExistUserCheckByUserIdQuery(String userId);

    //유저 정보 조회 ( 고유 아이디로 조회 )
    GetUserInfoQuery toGetUserInfoQuery(Long id);

    //유저 정보 조회 ( 로그인 아이디로 조회 )
    @Mapping(target = "userId", source = "userId")
    GetUserInfoByUserIdQuery toGetUserInfoByUserIdQuery(String userId);

    //유저 정보 응답
    UserInfoResponse toUserInfoResponse(User user);

    //유저 정보 수정
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "userName", source = "request.userName")
    @Mapping(target = "email", source = "request.email")
    @Mapping(target = "historyPrivate", source = "request.historyPrivate")
    @Mapping(target = "personalPrivate", source = "request.personalPrivate")
    ChangeUserInfoCommand toChangeUserInfoCommand(String userId, UpdateUserInfoRequest request);
}
