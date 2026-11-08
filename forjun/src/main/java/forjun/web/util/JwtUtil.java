package forjun.web.util;


import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secretKey}")
    private String secretKey;

    public String generateToken(String subject,String name, String authority) {
        try {
            return Jwts.builder()
                    .setSubject(subject)
                    .claim("userName",name)
                    .claim("authority",authority)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10시간 유효
                    .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), SignatureAlgorithm.HS256)
                    .compact();

        } catch (Exception e){
            throw new AppException(ErrorCode.JWT_NOT_GENERATE);
        }
    }

    public boolean validateToken(String token, String subject) {
        final String extractedSubject = extractSubject(token);
        return (extractedSubject.equals(subject) && !isTokenExpired(token));
    }

    public String extractSubject(String token) {
        //JWT 토큰 추출
        Claims claims = extractAllClaims(token);

        //토큰이 없는 경우 처리
        if(claims == null){
            throw new AppException(ErrorCode.JWT_NOT_FOUND);
        }

        //유효성 검사
        if(isTokenExpired(token)){
            throw new AppException(ErrorCode.JWT_EXPIRED);
        }

        //ID 추출
        String id = claims.getSubject();
        if(id == null || id.isEmpty()){
            throw new AppException(ErrorCode.JWT_NOT_FOUND);
        }

        //ID 반환
        return claims.getSubject();
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes())).build().parseClaimsJws(token).getBody();
    }
}
