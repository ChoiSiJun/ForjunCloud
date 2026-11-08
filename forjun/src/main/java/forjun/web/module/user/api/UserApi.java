package forjun.web.module.user.api;


import forjun.web.config.security.CustomUserDetail;
import forjun.web.module.user.api.dto.*;
import forjun.web.module.user.api.mapper.UserApiMapper;
import forjun.web.module.user.application.port.in.UserQuery;
import forjun.web.module.user.application.port.in.UserUsecase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "사용자 제어 API", description = "사용자 제어 API")
@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/user")
public class UserApi {

    private final UserQuery userQuery;
    private final UserUsecase userUsecase;
    private final UserApiMapper userApiMapper;

    /** 이용자 회원가입 */
    @Operation(summary = "이용자 회원가입", description = "이용자 회원가입")
    @PostMapping
    public ResponseEntity<Void> saveUser(@Valid @RequestBody UserJoinRequest userJoinRequest) {
        userUsecase.joinUser(userApiMapper.toUserJoinCommand(userJoinRequest));
        return ResponseEntity.ok().build();
    }

    /**
     * 이용자 아이디로 중복체크
     **/
    @Operation(summary = "이용자 아이디 중복체크", description = "이용자 아이디 중복체크 (true = 존재함 or false = 존재하지 않음)")
    @GetMapping("/duplicate")
    public ResponseEntity<Boolean> duplicateUser(@Valid @RequestParam @NotBlank(message = "아이디를 입력하지 않으셨습니다.") String userId){
        return ResponseEntity.ok(userQuery.existsByUserId(userApiMapper.toExistUserCheckByUserIdQuery(userId)));
    }

    /** 이용자 아이디로 정보조회 **/
    @GetMapping("/{id}")
    @Operation(summary = "이용자 정보조회", description = "이용자 정보조회")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserInfoResponse> viewUser(@PathVariable(name="id") Long id){
        return ResponseEntity.ok(userApiMapper.toUserInfoResponse(userQuery.getUser(userApiMapper.toGetUserInfoQuery(id))));
    }

    /** 개인정보 조회 **/
    @GetMapping
    @Operation(summary = "개인정보 조회", description = "개인정보 조회")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UserInfoResponse> viewUserInfo(@AuthenticationPrincipal CustomUserDetail user){
        return ResponseEntity.ok(userApiMapper.toUserInfoResponse(userQuery.getUserByUserId(userApiMapper.toGetUserInfoByUserIdQuery(user.getUserId()))));
    }
 

    /** 이용자 로그인**/
    @Operation(summary = "이용자 로그인", description = "이용자 로그인")
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody UserLoginRequest request){
        String token = userQuery.authentication(userApiMapper.toAuthenticationUserQuery(request));
        return ResponseEntity.ok(token);
    }

    /** 개인정보 수정 **/
    @Operation(summary = "개인정보 수정", description = "개인정보 수정")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping
    public ResponseEntity<Void> updateUserInfo(
        @AuthenticationPrincipal CustomUserDetail user,
        @Valid @RequestBody UpdateUserInfoRequest request
    ) {
        // 개인정보 수정 (Service에서 userId로 조회 및 수정 처리)
        userUsecase.changeUserInfo(
            userApiMapper.toChangeUserInfoCommand(user.getUserId(), request)
        );
        
        return ResponseEntity.ok().build();
    }
}
