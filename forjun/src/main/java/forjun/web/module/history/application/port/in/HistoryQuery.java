package forjun.web.module.history.application.port.in;

import forjun.web.module.history.application.port.in.dto.GetHistoryQuery;
import forjun.web.module.history.application.port.in.dto.GetHistorysQuery;
import forjun.web.module.history.application.port.in.dto.GetPublicHistorysQuery;
import forjun.web.module.history.domain.History;

import java.util.List;

/** 히스토리 조회 인터페이스 */
public interface HistoryQuery {

    //히스토리 리스트 조회
    List<History> getHistorys(GetHistorysQuery query);

    List<History> getPublicHistorys(GetPublicHistorysQuery query);

    //히스토리 조회
    History getHistory(GetHistoryQuery query);
}
