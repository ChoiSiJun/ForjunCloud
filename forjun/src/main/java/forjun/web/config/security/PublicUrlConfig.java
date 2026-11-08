package forjun.web.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

/** 공개 URL 설정 */
@Configuration
public class PublicUrlConfig {
    
    @Bean
    public Map<String, List<String>> publicUrls() {
        return Map.of(
                "GET", List.of(
                    "/api/v1/public-*/**", // 자기소개서 공개 조회
                    "/api/v1/user/duplicate", // 이용자 아이디 중복체크
                    "/v3/api-docs/**",      // OpenAPI 명세 JSON 경로
                    "/swagger-ui/**",       // Swagger UI 정적 리소스 경로
                    "/swagger-ui.html"      // Swagger UI 메인 페이지
                ),
                "POST", List.of(
                    "/api/v1/user", // 이용자 회원가입
                    "/api/v1/user/login" // 이용자 로그인
                )
        );
    }
}
