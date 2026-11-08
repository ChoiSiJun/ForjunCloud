package forjun.web.config.swagger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().info(new Info().title("Forjun API").version("v1.0.0"))
        .components(new Components().addSecuritySchemes("bearerAuth",  
        new SecurityScheme()
            .name("bearerAuth")
            .type(SecurityScheme.Type.HTTP) 
            .scheme("bearer")             
            .bearerFormat("JWT")            
            .in(SecurityScheme.In.HEADER)   
            .description("JWT 인증 토큰을 입력해 주세요.")
    ));
    }
}
