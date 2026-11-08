package forjun.web.config.security;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    /** 파일 업로드 자원원 리소스 URL */
    @Value("${file.upload.resource-url}")
    private String resourceUrl;

    /** JWT 인증 필터 */
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    /** 공개 URL 설정 */
    private final PublicUrlConfig publicUrlConfig;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .formLogin(formLogin -> formLogin.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .authorizeHttpRequests(auth -> {

                    //파일 업로드 자원원 리소스 URL 허용    
                    auth.requestMatchers(HttpMethod.GET, resourceUrl + "**").permitAll();
                    //OPTIONS 메서드 허용
                    auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                    //공개 URL 설정 허용
                    publicUrlConfig.publicUrls().forEach((method , urls) -> {
                        auth.requestMatchers(HttpMethod.valueOf(method) , urls.toArray(String[]::new))
                                .permitAll();
                    });

                    auth.anyRequest().authenticated();

                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        //JWT 인증 필터 추가
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    //스프링 시큐리티 CORS 설정.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 1. 허용할 출처 (정확함)
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3001", 
            "http://forjun.cloud",   // http 프로토콜 명시
            "https://forjun.cloud"   // https를 사용 중이라면 반드시 포함
        ));        
        // 2. 허용할 메서드 (수정됨: 순수 HTTP 메서드만 남깁니다)
        // 💡 resourceUrl + "**"를 여기서 제거해야 합니다!
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // 3. 허용할 헤더
        configuration.setAllowedHeaders(List.of("*"));
        
        // 4. 자격 증명 허용
        configuration.setAllowCredentials(true); 
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        
        // 5. 경로별 설정 적용
        // "/**"는 모든 경로에 위 설정을 적용하겠다는 뜻이므로 이미 resourceUrl 경로도 포함됩니다.
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

}
