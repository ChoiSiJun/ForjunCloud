package forjun.web.module.history.application.port.in.dto;

import java.time.LocalDate;
import java.util.List;

/** 히스토리 수정 명령 */
public record UpdateHistoryCommand(

    /** 유저 아이디 **/
    String userId,
    /** 히스토리 아이디 */
    Integer id,
    /** 카테고리 */
    String category,
    /** 프로젝트명 */
    String project,
    /** 주제 */
    String subject,
    /** 설명 */
    String description,
    /** 사용스킬 */
    List<String> historySkill,
    /** 히스토리 시작날짜 */
    LocalDate historyStartDate,
    /** 히스토리 종료날짜 */
    LocalDate historyEndDate
) {
    
}
