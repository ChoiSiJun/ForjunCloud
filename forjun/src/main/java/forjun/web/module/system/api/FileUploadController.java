package forjun.web.module.system.api;

import forjun.web.module.system.api.dto.UploadedFileResponse;
import forjun.web.module.system.api.mapper.FileUploadApiMapper;
import forjun.web.module.system.application.port.in.UploadUsecase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "파일 업로드 API", description = "파일 업로드 API")
@RestController
@RequestMapping("/api/system/files")
@RequiredArgsConstructor
public class FileUploadController {

    // UseCase
    private final UploadUsecase uploadUsecase;

    // Mapper
    private final FileUploadApiMapper fileUploadApiMapper;

    // 파일 업로드
    @PostMapping()
    @Operation(summary = "파일 업로드", description = "파일 업로드")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<UploadedFileResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("directory") String directory) {

        return ResponseEntity.ok(
                fileUploadApiMapper.toUploadedFileResponse(uploadUsecase.uploadFile(file, directory))
        );
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> delete(@PathVariable String fileId) {
        uploadUsecase.deleteFile(fileId);
        return ResponseEntity.ok().build();
    }
}