package forjun.web.module.personal.domain;

import forjun.web.module.personal.domain.value.PersonalAward;
import forjun.web.module.personal.domain.value.PersonalCertificate;
import forjun.web.module.personal.domain.value.PersonalCompany;
import forjun.web.module.personal.domain.value.PersonalSkill;
import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
public class Personal {

    private Long id;
    private String userId;
    private String job;
    private String name;
    private String education;
    private String gradePointAverage;
    private String introduction;
    private String profile_image_id;

    @Builder.Default
    List<PersonalAward> personalAwards = new ArrayList<>();

    @Builder.Default
    List<PersonalCompany> personalCompanys = new ArrayList<>();

    @Builder.Default
    List<PersonalSkill> personalSkills = new ArrayList<>();

    @Builder.Default
    List<PersonalCertificate> personalCertificates = new ArrayList<>();

}
