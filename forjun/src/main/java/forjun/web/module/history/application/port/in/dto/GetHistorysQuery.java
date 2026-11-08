package forjun.web.module.history.application.port.in.dto;

/** 히스토리 리스트 조회 쿼리 */
public record GetHistorysQuery(

    /** 카테고리 */
    String category, 

    /** 이용자 아이디 */
    String userId) {
    
}
