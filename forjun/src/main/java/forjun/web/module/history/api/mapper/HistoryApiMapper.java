package forjun.web.module.history.api.mapper;

import forjun.web.module.history.api.dto.CreateHistoryRequest;
import forjun.web.module.history.api.dto.GetPublicHistoryListRequest;
import forjun.web.module.history.api.dto.HistoryDetailResponse;
import forjun.web.module.history.api.dto.UpdateHistoryRequest;
import forjun.web.module.history.application.port.in.dto.CreateHistoryCommand;
import forjun.web.module.history.application.port.in.dto.DeleteHistoryCommand;
import forjun.web.module.history.application.port.in.dto.GetHistoryQuery;
import forjun.web.module.history.application.port.in.dto.GetHistorysQuery;
import forjun.web.module.history.application.port.in.dto.GetPublicHistorysQuery;
import forjun.web.module.history.application.port.in.dto.UpdateHistoryCommand;
import forjun.web.module.history.domain.History;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;


/** 히스토리 API 매퍼 */

@Mapper(componentModel = "spring")
public interface HistoryApiMapper {

    /** 히스토리 등록 명령 매핑 */
    @Mapping(target = "userId" , source = "userId")
    CreateHistoryCommand toCreateHistoryCommand(String userId, CreateHistoryRequest request);

    /** 히스토리 수정 명령 매핑 */
    @Mapping(target = "id" , source = "historyId")
    UpdateHistoryCommand toUpdateHistoryCommand(String userId , int historyId, UpdateHistoryRequest request);

    /** 히스토리 조회 쿼리 매핑 */
    @Mapping(target = "historyId" , source = "historyId")
    GetHistoryQuery toGetHistoryQuery(String userId, Integer historyId);

    /** 히스토리 삭제 명령 매핑 */
    DeleteHistoryCommand toDeleteHistoryCommand(String userId, Integer historyId);

    /** 히스토리 리스트 조회 쿼리 매핑 */
    @Mapping(target = "category" , source = "category")
    @Mapping(target = "userId" , source = "userId")
    GetHistorysQuery toGetHistorysQuery(String category, String userId);


    /** 퍼블릭 히스토리 리스트 조회 쿼리 매핑 */
    GetPublicHistorysQuery toGetHistorysQuery(GetPublicHistoryListRequest request);
    
    /** 히스토리 응답 매핑 */
    HistoryDetailResponse toHistoryResponse(History history);
    
    /** 히스토리 리스트 응답 매핑 */
    List<HistoryDetailResponse> toHistoryReponseList(List<History> historyList);
}
