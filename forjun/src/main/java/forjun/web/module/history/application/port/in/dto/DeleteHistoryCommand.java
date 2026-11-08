package forjun.web.module.history.application.port.in.dto;

/** 히스토리 삭제 명령 */
public record DeleteHistoryCommand(String userId, Integer historyId) {
}
