package forjun.web.module.system.domain;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 시스템에 저장된 모든 파일의 핵심 정보를 담는 불변 도메인 모델
 */
@Getter
@Builder
public class UploadFile {

    private final String fileId;        // 파일의 고유 식별자
    private final String originalName;  // 원본 파일명
    private final String storedPath;    // 파일 저장 경로 (S3 key)
    private final String url;           // 최종 접근 가능한 Public URL
    private final long size;            // 파일 크기 (바이트)
    private final String contentType;    // 파일 타입 (e.g., application/pdf, image/jpeg)
    private final LocalDateTime uploadAt; //파일 업로드 날짜
    private String hashData;

    // 파일 확장자 가져오기.
    public String getExtension() {
        int lastDot = originalName.lastIndexOf('.');
        return (lastDot == -1) ? "" : originalName.substring(lastDot + 1);
    }
}