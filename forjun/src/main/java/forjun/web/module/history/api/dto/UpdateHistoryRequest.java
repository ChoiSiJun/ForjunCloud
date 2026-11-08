package forjun.web.module.history.api.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotNull;

/** 히스토리 수정 요청 */
public record UpdateHistoryRequest(

    /** 히스토리 아이디 */
    @NotNull(message = "히스토리 아이디는 필수 항목입니다.")
    Integer id,
    
    /** 카테고리 */
    @NotNull(message = "카테고리는 필수 항목입니다.")
    String category,
    
    /** 프로젝트명 */
    @NotNull(message = "프로젝트명은 필수 항목입니다.")
    String project,
    
    /** 주제 */
    String subject,
    
    /** 설명 */
    String description,
    
    /** 사용스킬 */
    List<String> historySkill,
    
    /** 히스토리 시작날짜 */
    @NotNull(message = "히스토리 시작날짜는 필수 항목입니다.")
    LocalDate historyStartDate,
    
    /** 히스토리 종료날짜 */
    @NotNull(message = "히스토리 종료날짜는 필수 항목입니다.")
    LocalDate historyEndDate
) {
}