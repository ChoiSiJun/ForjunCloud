package forjun.web.module.history.application.port.in;
import forjun.web.module.history.application.port.in.dto.CreateHistoryCommand;
import forjun.web.module.history.application.port.in.dto.DeleteHistoryCommand;
import forjun.web.module.history.application.port.in.dto.UpdateHistoryCommand;

/** 히스토리 사용 인터페이스 */
public interface HistoryUsecase {

    //히스토리 저장
    void createHistory(CreateHistoryCommand command);

    //히스토리 수정
    void updateHistory(UpdateHistoryCommand command);
    
    //히스토리 삭제
    void deleteHistory(DeleteHistoryCommand command);
}
