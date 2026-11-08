package forjun.web.module.personal.api;

import forjun.web.config.security.CustomUserDetail;
import forjun.web.module.personal.api.dto.PersonalDetailResponse;
import forjun.web.module.personal.api.dto.SavePersonalRequest;
import forjun.web.module.personal.api.mapper.PersonalApiMapper;
import forjun.web.module.personal.application.port.in.PersonalQuery;
import forjun.web.module.personal.application.port.in.PersonalUseCase;
import forjun.web.module.personal.application.port.in.dto.GetPersonalQuery;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** 자기소개서 제어 API*/
@Tag(name = "자기소개서 제어 API", description = "자기소개서 제어 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/personal")
public class PersonalController {

    // Mapper
    private final PersonalApiMapper personalApiMapper;

    // Query
    private final PersonalQuery personalQuery;

    // UseCase
    private final PersonalUseCase personalUseCase;
    //자기소개서 저장
    @Operation(summary = "자기소개서 저장", description = "자기소개서 저장")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<Void> savePersonal(
        @AuthenticationPrincipal CustomUserDetail user, 
        @Valid @RequestBody SavePersonalRequest requestDto
    ) {

        // 인증 정보 가져오기
        personalUseCase.savePersonal(personalApiMapper.toSavePersonalCommand(user.getUserId(), requestDto));
        // 자기소개서 저장 응답
        return ResponseEntity.ok().build();
    }

    //자기소개서 가져오기
    @Operation(summary = "자기소개서 가져오기", description = "자기소개서 가져오기")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<PersonalDetailResponse> getPersonal(  
        @AuthenticationPrincipal CustomUserDetail user
    ) {

        // 자기소개서 조회
        return ResponseEntity.ok(
            personalApiMapper.toPersonalResponseDto(
                personalQuery.getPersonal(new GetPersonalQuery(user.getUserId())) )
        );
    }
}
