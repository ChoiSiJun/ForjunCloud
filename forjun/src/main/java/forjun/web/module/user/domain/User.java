package forjun.web.module.user.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Getter
@AllArgsConstructor
@Builder
public class User {

    private Long id;
    private String userId;
    private String password;
    private String userName;
    private String email;
    private String authority;
    private String historyPrivate;
    private String personalPrivate;

    //패스워드 암호화
    public void decryptPassword(){
        if(this.password == null || this.password.isEmpty()){
            throw new RuntimeException("Password is empty");
        }
        this.password = new BCryptPasswordEncoder().encode(this.password);
    }
}
