package forjun.web.module.personal.domain.value;

import lombok.Builder;
import lombok.Getter;

/** 자기소개서 경력 */
@Getter
@Builder
public class PersonalCompany {

    /** 회사명 */
    private String companyName;
    /** 시작일 */
    private String startDate;
    /** 종료일 */
    private String endDate;
}
