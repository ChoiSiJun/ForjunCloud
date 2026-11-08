package forjun.web.module.personal.application;

import java.util.stream.Collectors;

import forjun.web.module.personal.application.port.in.dto.SavePersonalCommand;
import forjun.web.module.personal.domain.Personal;
import forjun.web.module.personal.domain.value.PersonalAward;
import forjun.web.module.personal.domain.value.PersonalCompany;
import forjun.web.module.personal.domain.value.PersonalSkill;
import forjun.web.module.personal.domain.value.PersonalCertificate;

public class PersonalFactory {
    
    /** 자기소개서 도메인 생성 */
    public static Personal createPersonal(SavePersonalCommand command) {

        if(command == null) {
            throw new IllegalArgumentException("command is null");
        }
        if(command.userId() == null || command.userId().isEmpty()) {
            throw new IllegalArgumentException("userId is null or empty");
        }
    
        return Personal.builder()
            .userId(command.userId())
            .job(command.job())
            .name(command.name())
            .education(command.education())
            .gradePointAverage(command.gradePointAverage())
            .introduction(command.introduction())
            .profile_image_id(command.profile_image_id())
            .personalAwards(command.awards().stream()
                .map(data -> PersonalAward.builder().awardName(data.awardName()).build())
                .collect(Collectors.toList()))
            .personalSkills(command.skills().stream()
                .map(data -> PersonalSkill.builder().skillName(data.skillName()).skillCategory(data.skillCategory()).build())
                .collect(Collectors.toList()))
            .personalCompanys(command.companies().stream()
                .map(data -> PersonalCompany.builder().companyName(data.companyName()).startDate(data.startDate()).endDate(data.endDate()).build())
                .collect(Collectors.toList()))

            .personalCertificates(command.certificates().stream()
                .map(data -> PersonalCertificate.builder().certificateName(data.certificateName()).certificateAcquisitionOrganization(data.certificateAcquisitionOrganization()).certificateAcquisitionDate(data.certificateAcquisitionDate()).build())
                .collect(Collectors.toList()))
            .build();
    }
}
