package forjun.web.module.personal.domain.value;

import lombok.Builder;
import lombok.Getter;

/** 자기소개서 수상 */

@Getter
@Builder
public class PersonalAward {
    private String awardName;
}
