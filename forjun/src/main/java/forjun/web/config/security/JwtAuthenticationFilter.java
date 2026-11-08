package forjun.web.config.security;

import forjun.web.module.user.application.UserService;
import forjun.web.module.user.application.port.in.dto.GetUserInfoByUserIdQuery;
import forjun.web.module.user.domain.User;
import forjun.web.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/** JWT 인증 필터 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /** JWT 유틸 */
    private final JwtUtil jwtUtil;
    /** 사용자 서비스 */
    private final UserService userService;

    /** JWT 인증 필터 내부 처리 */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
        throws ServletException, IOException 
    {
        //인증 헤더 추출
        final String authorizationHeader = request.getHeader("Authorization");
        //JWT 추출
        String jwt = null;
        //ID 추출
        String id = null;

        //인증 헤더가 있고 Bearer 토큰 형식인 경우 처리
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            
            try {
                //ID 추출
                id = jwtUtil.extractSubject(jwt);
            } catch (Exception e) {
             
                //다음 필터 체인으로 이동
                filterChain.doFilter(request, response);
                return; 
            }
        }

        //ID가 추출되었고, 아직 인증 컨텍스트가 비어있는 경우 처리
        if (id != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 사용자 조회 (DB 접근)
            GetUserInfoByUserIdQuery query = new GetUserInfoByUserIdQuery(id);
            User user = userService.getUserByUserId(query);

            //사용자 존재 경우 처리
            if (user != null) {
                
                //사용자 상세 정보 객체 생성
                CustomUserDetail userDetails = CustomUserDetail.builder()
                    .id(user.getId())
                    .userId(user.getUserId())
                    .authorities(new ArrayList<>()) // 임시 부여
                    .build();

                //JWT 유효성 검사
                if (jwtUtil.validateToken(jwt, String.valueOf(userDetails.getUserId()))) {

                    //권한 부여
                    List<GrantedAuthority> grantedAuthorities;
                    String authorityString = user.getAuthority();

                    if (authorityString != null && !authorityString.isEmpty()) {
                        grantedAuthorities = Arrays.stream(authorityString.split(",")) 
                            .map(String::trim)
                            .filter(auth -> !auth.isEmpty())
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                    } else {
                        grantedAuthorities = List.of(new SimpleGrantedAuthority("GUEST"));
                    }
               
                    //인증 토큰 생성
                    UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, grantedAuthorities); // 💡 권한을 직접 전달
                    
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
        }

        // 인증 여부와 관계없이 다음 필터 체인으로 이동
        filterChain.doFilter(request, response);
    }
}