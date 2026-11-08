package forjun.web.module.user.infrastructure.jpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String password;

    private String userName;

    private String email;

    private String authority;

    private String historyPrivate;

    private String personalPrivate;

    //패스워드 변경
    public void updatePassword(String password){
        if(password != null && !password.isEmpty()){
            this.password = password;
        }
    }
}
