package forjun.web.module.history.api;


import forjun.web.config.security.CustomUserDetail;
import forjun.web.module.history.api.dto.CreateHistoryRequest;
import forjun.web.module.history.api.dto.HistoryDetailResponse;
import forjun.web.module.history.api.dto.UpdateHistoryRequest;
import forjun.web.module.history.api.mapper.HistoryApiMapper;
import forjun.web.module.history.application.port.in.HistoryQuery;
import forjun.web.module.history.application.port.in.HistoryUsecase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Tag(name = "히스토리 제어 API", description = "히스토리 제어 API")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/history")
public class HistoryApi {


    private final HistoryQuery historyQuery;
    private final HistoryUsecase historyUsecase;
    private final HistoryApiMapper historyApiMapper;

    /** 히스토리 등록*/
    @Operation(summary = "히스토리 등록", description = "히스토리 등록")
    @PostMapping
    public ResponseEntity<Void> registerHistory(@AuthenticationPrincipal CustomUserDetail user, @RequestBody CreateHistoryRequest request) {
        historyUsecase.createHistory(historyApiMapper.toCreateHistoryCommand(user.getUserId(),request));
        return ResponseEntity.ok().build();
    }
    /** 히스토리 업데이트 */
    @Operation(summary = "히스토리 업데이트", description = "히스토리 업데이트")
    @PutMapping("/{historyId}")
    public ResponseEntity<Void> updateHistory(@AuthenticationPrincipal CustomUserDetail user , @PathVariable int historyId, @RequestBody UpdateHistoryRequest request){

        //히스토리 유저체크
        historyUsecase.updateHistory(historyApiMapper.toUpdateHistoryCommand(user.getUserId() , historyId, request));
        return ResponseEntity.ok().build();
    }

    /** 히스토리 가져오기 */
    @Operation(summary = "히스토리 가져오기", description = "히스토리 가져오기")
    @GetMapping("/{historyId}")
    public ResponseEntity<HistoryDetailResponse> getHistory(@AuthenticationPrincipal CustomUserDetail user, @PathVariable int historyId)
    {
        return ResponseEntity.ok(historyApiMapper.toHistoryResponse(historyQuery.getHistory(historyApiMapper.toGetHistoryQuery(user.getUserId(), historyId))));
    }

    /** 히스토리 리스트 가져오기*/
    @Operation(summary = "히스토리 리스트 가져오기", description = "히스토리 리스트 가져오기")
    @GetMapping("/list")
    public ResponseEntity<List<HistoryDetailResponse>> histories(@AuthenticationPrincipal CustomUserDetail user, @RequestParam String category)
    {
        
        return ResponseEntity.ok(historyApiMapper.toHistoryReponseList(
            historyQuery.getHistorys(
                historyApiMapper.toGetHistorysQuery(category,user.getUserId())
            )
        ));
    }

    /** 히스토리 삭제 */
    @Operation(summary = "히스토리 삭제", description = "히스토리 삭제")
    @DeleteMapping("/{historyId}")
    public ResponseEntity<Void> deleteHistory(@AuthenticationPrincipal CustomUserDetail user, @PathVariable int historyId) {
        historyUsecase.deleteHistory(historyApiMapper.toDeleteHistoryCommand(user.getUserId(), historyId));
        return ResponseEntity.ok().build();
    }
}
