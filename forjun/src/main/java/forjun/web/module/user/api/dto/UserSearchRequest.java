package forjun.web.module.user.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSearchRequest {

    //아이디
    private String userId;

    //이름
    private String userName;
}
