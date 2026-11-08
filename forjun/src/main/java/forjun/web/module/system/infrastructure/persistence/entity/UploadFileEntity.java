package forjun.web.module.system.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "UPLOADED_FILE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder // 💡 클래스 레벨에
public class UploadFileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // DB 테이블의 Primary Key (내부 관리용)

    // 파일의 고유 식별자 (UUID). 비즈니스 로직에서 파일을 참조할 때 사용
    @Column(name = "FILE_ID", nullable = false, unique = true, length = 36)
    private String fileId;

    // 클라이언트가 업로드한 원본 파일 이름
    @Column(name = "ORIGINAL_NAME", nullable = false, length = 255)
    private String originalName;

    // 파일이 저장된 물리적인 경로 (Local Path 또는 S3 Key)
    @Column(name = "STORED_PATH", nullable = false, length = 512)
    private String storedPath;

    // 파일에 접근 가능한 최종 URL (CDN 또는 Download API 경로)
    @Column(name = "FILE_URL", nullable = false, length = 512)
    private String url;

    // 파일 크기 (바이트)
    @Column(name = "SIZE", nullable = false)
    private Long size;

    // 파일 타입 (MIME 타입: image/jpeg, application/pdf 등)
    @Column(name = "CONTENT_TYPE", nullable = false, length = 100)
    private String contentType;

    // 파일이 업로드된 시간
    @Column(name = "UPLOAD_AT", nullable = false)
    @Builder.Default
    private LocalDateTime uploadAt = LocalDateTime.now();

    @Column(name = "HASH_DATA", nullable = false)
    private String hashData;
}
