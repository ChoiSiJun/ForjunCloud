package forjun.web.module.history.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class History {

    //히스토리 아이디
    private Integer id;

    //이용자 아이디
    private String userId;

    //카테고리
    private String category;

    //프로젝트명
    private String project;

    //주제
    private String subject;

    //설명
    private String description;

    //사용스킬
    private List<String> historySkill;

    //히스토리 시작날짜
    private LocalDate historyStartDate;

    //히스토리 종료날짜
    private LocalDate  historyEndDate;
}
