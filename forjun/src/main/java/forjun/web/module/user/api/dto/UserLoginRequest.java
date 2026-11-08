package forjun.web.module.user.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginRequest {

    @NotBlank(message = "아이디를 입력하지 않으셨습니다.")
    private String userId;
    
    @NotBlank(message = "패스워드를 입력하지 않으셨습니다.")
    private String password;

}
