package forjun.web.module.history.application;

import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.module.history.application.port.in.HistoryQuery;
import forjun.web.module.history.application.port.in.HistoryUsecase;
import forjun.web.module.history.application.port.in.dto.CreateHistoryCommand;
import forjun.web.module.history.application.port.in.dto.DeleteHistoryCommand;
import forjun.web.module.history.application.port.in.dto.GetHistoryQuery;
import forjun.web.module.history.application.port.in.dto.GetHistorysQuery;
import forjun.web.module.history.application.port.in.dto.GetPublicHistorysQuery;
import forjun.web.module.history.application.port.in.dto.UpdateHistoryCommand;
import forjun.web.module.history.domain.History;
import forjun.web.module.user.application.port.in.UserQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoByUserIdQuery;
import forjun.web.module.user.domain.PrivateStatus;
import forjun.web.module.user.domain.User;
import forjun.web.module.history.application.port.out.HistoryJpaPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HistoryService implements HistoryQuery , HistoryUsecase {

    /** 히스토리 Jpa 포트 */
    private final HistoryJpaPort historyJpaPort;

    /** 유저 서비스 */
    private final UserQuery userQuery;

    @Override
    public void createHistory(CreateHistoryCommand command) {

        //히스토리 도메인 생성 후 저장
        historyJpaPort.saveHistory(HistoryFactory.createHistory(command));
    }

    @Override
    public void updateHistory(UpdateHistoryCommand command) {

        //히스토리 존재 여부 확인
        History existing = historyJpaPort.getHistory(command.id())
                .orElseThrow(() -> AppException.of(ErrorCode.HISTORY_NOT_FOUND, command.id()));

        // 저장된 소유자와 인증된 요청 사용자를 비교한다.
        if (existing.getUserId() == null || !existing.getUserId().equals(command.userId())) {
            throw AppException.of(ErrorCode.HISTORY_NOT_ACCESS, command.id());
        }

        //히스토리 도메인 생성 후 수정
        historyJpaPort.updateHistory(HistoryFactory.createHistory(command));
    }

    @Override
    public void deleteHistory(DeleteHistoryCommand command) {

        History existing = historyJpaPort.getHistory(command.historyId())
                .orElseThrow(() -> AppException.of(ErrorCode.HISTORY_NOT_FOUND, command.historyId()));

        if (existing.getUserId() == null || !existing.getUserId().equals(command.userId())) {
            throw AppException.of(ErrorCode.HISTORY_NOT_ACCESS, command.historyId());
        }

        //히스토리 삭제
        historyJpaPort.deleteHistory(command.historyId());
    }

    @Override
    public List<History> getHistorys(GetHistorysQuery query) {

        //히스토리 리스트 조회
        return historyJpaPort.getHistorys(query.category() , query.userId());
    }

    @Override
    public History getHistory(GetHistoryQuery query) {

        //히스토리 조회
        History existing = historyJpaPort.getHistory(query.historyId())
                .orElseThrow(() -> AppException.of(ErrorCode.HISTORY_NOT_FOUND, query.historyId()));

        if (existing.getUserId() == null || !existing.getUserId().equals(query.userId())) {
            throw AppException.of(ErrorCode.HISTORY_NOT_ACCESS, query.historyId());
        }

        //히스토리 반환
        return existing;
    }

    /** 퍼블릭 히스토리 리스트 조회 */
    @Override
    public List<History> getPublicHistorys(GetPublicHistorysQuery query) {

        //퍼블릭 히스토리 유저 접근정보 체크
        String userId = query.userId();

        //유저 정보 조회
        GetUserInfoByUserIdQuery userParameterQuery = new GetUserInfoByUserIdQuery(userId);
        User user = userQuery.getUserByUserId(userParameterQuery);

        //유저 존재여부 체크
        if(user == null){
            throw AppException.of(ErrorCode.USER_NOT_FOUND, userId);
        }

        //히스토리 접근 권한 체크
        if(!user.getHistoryPrivate().equals(PrivateStatus.PUBLIC.name())){
            throw AppException.of(ErrorCode.HISTORY_NOT_ACCESS, query.userId());
        }

        //퍼블릭 히스토리 리스트 조회
        return historyJpaPort.getHistorys(query.category() , query.userId());
    }
}
