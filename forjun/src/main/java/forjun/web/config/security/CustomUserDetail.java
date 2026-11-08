package forjun.web.config.security;

import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Builder
public class CustomUserDetail implements UserDetails {

    private Long id;

    @Getter
    private String userId;

    private List<GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return id != null ? (String.valueOf(id)) : "";
    }

    @Override
    public String getPassword() {
        return "";
    }

}
