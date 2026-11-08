package forjun.web.module.history.application.port.in.dto;

/** 히스토리 조회 쿼리 */
public record GetHistoryQuery(String userId, Integer historyId) {
}
