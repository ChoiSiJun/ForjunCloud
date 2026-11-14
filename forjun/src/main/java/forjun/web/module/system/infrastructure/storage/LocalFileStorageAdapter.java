package forjun.web.module.system.infrastructure.storage;

import forjun.web.module.system.application.port.out.FileStoragePort;
import forjun.web.module.system.application.port.out.InvalidUploadPathException;
import forjun.web.module.system.domain.UploadFile;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.LinkOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.DigestInputStream;
import java.util.HexFormat;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Component
@Slf4j
public class LocalFileStorageAdapter implements FileStoragePort {

    private final String resourcePath;

    /**
     * @param resourcePath application.yml에서 주입받은 로컬 업로드 디렉토리 경로
     */
    public LocalFileStorageAdapter(@Value("${file.upload.resource-path}") String resourcePath) {

        this.resourcePath = resourcePath;

        // 💡 1. 디렉토리 검사 및 생성 로직 추가
        if (StringUtils.hasText(resourcePath)) {
            Path uploadPath = Paths.get(resourcePath);
            if (!Files.exists(uploadPath)) {
                try {
                    Files.createDirectories(uploadPath); // 디렉토리 구조가 여러 단계여도 안전하게 생성
                    log.info("업로드 디렉토리 생성 완료: {}", resourcePath);
                } catch (IOException e) {
                    log.error("업로드 디렉토리 생성 실패", e);
                    // 초기화 실패는 애플리케이션 시작을 막아야 함
                    throw new RuntimeException("파일 저장소 초기화 실패: 디렉토리를 생성할 수 없습니다.", e);
                }
            }
        } else {
            log.warn("파일 저장소: 'file.upload.local-dir' 설정값이 비어있습니다. 실제 파일 저장 시 오류가 발생할 수 있습니다.");
            throw new RuntimeException("파일 저장소 경로(local-dir)가 설정되지 않았습니다.");
        }
    }

    @Override
    public UploadFile save(MultipartFile file , String directory) {

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileId = UUID.randomUUID().toString();
        String fileExtension = getFileExtension(originalFilename);

        // 1. 파일 확장자 검사
        if (!fileExtension.matches("[A-Za-z0-9]*")) {
            throw new InvalidUploadPathException();
        }
        String storedFileName = fileId + "." + fileExtension;

        // 상대 디렉터리 이름만 허용한다. 양쪽 OS의 구분자와 드라이브 경로도 검사한다.
        directory = directory == null ? "" : directory;
        if (!directory.isEmpty() && !directory.matches("[\\p{L}\\p{N}_-]+(/[\\p{L}\\p{N}_-]+)*")) {
            throw new InvalidUploadPathException();
        }

        // 💡 2. 경로 검증 및 파일 저장 로직 개선
        Path root = Paths.get(resourcePath).toAbsolutePath().normalize();
        Path targetDirectory = root.resolve(directory).normalize();
        Path targetLocation = targetDirectory.resolve(storedFileName).normalize();
        if (!targetLocation.startsWith(root)) {
            throw new InvalidUploadPathException();
        }
        String urlPath = root.relativize(targetLocation).toString().replace('\\', '/');
        LocalDateTime uploadDate = LocalDateTime.now();

        try {
            // 기존 심볼릭 링크나 정션을 통해 루트 밖으로 나가는 것도 막는다.
            Path realRoot = root.toRealPath();
            Path current = root;
            if (!directory.isEmpty()) {
                for (String segment : directory.split("/")) {
                    current = current.resolve(segment);
                    if (Files.exists(current, LinkOption.NOFOLLOW_LINKS)) {
                        if (Files.isSymbolicLink(current) || !current.toRealPath().startsWith(realRoot)) {
                            throw new InvalidUploadPathException();
                        }
                    } else {
                        Files.createDirectory(current);
                    }
                }
            }
            var digest = DigestUtils.getSha256Digest();
            try (InputStream input = new DigestInputStream(file.getInputStream(), digest)) {
                Files.copy(input, targetLocation);
            }

            return UploadFile.builder()
                    .fileId(fileId)
                    .originalName(originalFilename)
                    .storedPath(targetLocation.toString())
                    .url(urlPath)
                    .size(file.getSize())
                    .contentType(file.getContentType())
                    .uploadAt(uploadDate)
                    .hashData(HexFormat.of().formatHex(digest.digest()))
                    .build();

        } catch (IOException e) {
            log.error("로컬 파일 저장 실패: {}", originalFilename, e);
            // 인프라 예외를 런타임 예외로 변환
            throw new RuntimeException("파일을 로컬 시스템에 저장하는 데 실패했습니다.", e);
        }
    }

    @Override
    public void delete(String storedPath) {

        Path filePath = Paths.get(storedPath);
        try {
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                log.info("로컬 파일 삭제 성공. 경로: {}", storedPath);
            } else {
                log.warn("로컬 파일 삭제 실패: 파일을 찾을 수 없음. 경로: {}", storedPath);
            }
        } catch (IOException e) {
            log.error("로컬 파일 삭제 중 IO 오류 발생. 경로: {}", storedPath, e);
            // 인프라 예외를 런타임 예외로 변환
            throw new RuntimeException("로컬 파일 시스템에서 파일 삭제 실패했습니다.", e);
        }
    }

    // 파일 확장자를 추출하는 헬퍼 함수
    private String getFileExtension(String originalName) {
        int lastDot = originalName.lastIndexOf('.');
        return (lastDot == -1) ? "" : originalName.substring(lastDot + 1);
    }
}
