package forjun.web.module.personal.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import forjun.web.module.personal.api.dto.PersonalDetailResponse;
import forjun.web.module.personal.api.mapper.PersonalApiMapper;
import forjun.web.module.personal.application.port.in.PersonalQuery;
import forjun.web.module.personal.application.port.in.dto.GetPublicPersonalQuery;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "자기소개서 공개 API", description = "자기소개서 공개 API")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/public-personal")
public class PersonalPublicApi {

    // Query
    private final PersonalQuery personalQuery;

    // Mapper
    private final PersonalApiMapper personalApiMapper;

    // 자기소개서 공개 조회
    @GetMapping("/{userId}")
    @Operation(summary = "자기소개서 공개 조회", description = "자기소개서 공개 조회")
    public ResponseEntity<PersonalDetailResponse> getPublicPersonal(
        @Valid @PathVariable @NotNull(message = "이용자 아이디는 필수 입력 값입니다.") String userId
    ) {
        return ResponseEntity.ok(personalApiMapper.toPersonalResponseDto(personalQuery.getPublicPersonal(new GetPublicPersonalQuery(userId))));
    }
}
