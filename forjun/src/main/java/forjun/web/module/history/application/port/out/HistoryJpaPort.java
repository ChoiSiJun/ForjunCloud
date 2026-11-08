package forjun.web.module.history.application.port.out;

import forjun.web.module.history.domain.History;

import java.util.List;
import java.util.Optional;

public interface HistoryJpaPort {

    //저장
    void saveHistory(History history);

    //수정
    void updateHistory(History history);

    //개별 조회
    Optional<History> getHistory(Integer historyId);

    //리스트 조회
    List<History> getHistorys(String category , String userId);
    
    //삭제
    void deleteHistory(int historyId);

    //히스토리 존재여부 체크
    boolean existsHistory(Integer historyId);
}
