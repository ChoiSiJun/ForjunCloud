package forjun.web.module.user.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserInfoRequest {

    @NotBlank(message = "이름은 필수 항목입니다.")
    private String userName;

    @NotBlank(message = "이메일은 필수 항목입니다.")
    private String email;

    @NotBlank(message = "히스토리 공개 설정은 필수 항목입니다.")
    private String historyPrivate;

    @NotBlank(message = "자기소개서 공개 설정은 필수 항목입니다.")
    private String personalPrivate;
}

