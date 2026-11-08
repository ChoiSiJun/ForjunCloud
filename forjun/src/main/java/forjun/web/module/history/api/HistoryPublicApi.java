package forjun.web.module.history.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import forjun.web.module.history.api.dto.GetPublicHistoryListRequest;
import forjun.web.module.history.api.dto.HistoryDetailResponse;
import forjun.web.module.history.api.mapper.HistoryApiMapper;
import forjun.web.module.history.application.port.in.HistoryQuery;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "퍼블릭 히스토리 제어 API", description = "퍼블릭 히스토리 제어 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public-history")
public class HistoryPublicApi {

    private final HistoryQuery historyQuery;
    private final HistoryApiMapper historyApiMapper;


    @Operation(summary = "히스토리 리스트 가져오기", description = "히스토리 리스트 가져오기")
    @GetMapping("/list")
    public ResponseEntity<List<HistoryDetailResponse>> getHistoryList(@Valid @ModelAttribute GetPublicHistoryListRequest request) {

        //히스토리 리스트 조회
        return ResponseEntity.ok(historyApiMapper.toHistoryReponseList(
            historyQuery.getPublicHistorys(historyApiMapper.toGetHistorysQuery(request))
        ));

    }    
}
