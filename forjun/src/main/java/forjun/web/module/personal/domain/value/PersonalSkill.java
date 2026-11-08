package forjun.web.module.personal.domain.value;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PersonalSkill {

    private String skillName;
    private String skillCategory;
}
