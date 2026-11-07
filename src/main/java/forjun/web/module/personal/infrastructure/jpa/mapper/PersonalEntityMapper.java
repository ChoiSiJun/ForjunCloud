package forjun.web.module.personal.infrastructure.jpa.mapper;

import forjun.web.module.personal.domain.Personal;
import forjun.web.module.personal.domain.value.PersonalAward;
import forjun.web.module.personal.domain.value.PersonalCertificate;
import forjun.web.module.personal.domain.value.PersonalCompany;
import forjun.web.module.personal.domain.value.PersonalSkill;
import forjun.web.module.personal.infrastructure.jpa.entity.PersonalAwardEntity;
import forjun.web.module.personal.infrastructure.jpa.entity.PersonalCertificateEntity;
import forjun.web.module.personal.infrastructure.jpa.entity.PersonalCompanyEntity;
import forjun.web.module.personal.infrastructure.jpa.entity.PersonalEntity;
import forjun.web.module.personal.infrastructure.jpa.entity.PersonalSkillEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PersonalEntityMapper {

    /** 자기소개서 도메인 -> 자기소개서 JPA 엔티티 변환 */
    public PersonalEntity toEntity(Personal personal) {
        PersonalEntity personalEntity = PersonalEntity.builder()
                .userId(personal.getUserId())
                .name(personal.getName())
                .job(personal.getJob())
                .education(personal.getEducation())
                .gradePointAverage(personal.getGradePointAverage())
                .introduction(personal.getIntroduction())
                .profileImageId(personal.getProfile_image_id())
                .build();

        // Award 매핑
        personal.getPersonalAwards()
                .forEach(award -> {
                    PersonalAwardEntity awardEntity = toEntity(award);
                    personalEntity.addAward(awardEntity); // 편의 메서드
                });

        // Skill 매핑
        personal.getPersonalSkills()
                .forEach(skill -> {
                    PersonalSkillEntity skillEntity = toEntity(skill);
                    personalEntity.addSkill(skillEntity); // 편의 메서드
                });

        // Company 매핑
        personal.getPersonalCompanys()
                .forEach(company -> {
                    PersonalCompanyEntity companyEntity = toEntity(company);
                    personalEntity.addCompany(companyEntity); // 편의 메서드
                });

        // Certificate 매핑
        personal.getPersonalCertificates()
                .forEach(certificate -> {
                    PersonalCertificateEntity certificateEntity = toEntity(certificate);
                    personalEntity.addCertificate(certificateEntity); // 편의 메서드
                });

        return personalEntity;
    }

    /** 수상 도메인 -> 수상 JPA 엔티티 변환 */
    public PersonalAwardEntity toEntity(PersonalAward award) {
        return PersonalAwardEntity.builder()
                .awardName(award.getAwardName())
                .build();
    }

    /** 스킬 도메인 -> 스킬 JPA 엔티티 변환 */
    public PersonalSkillEntity toEntity(PersonalSkill skill) {
        return PersonalSkillEntity.builder()
                .skillName(skill.getSkillName())
                .skillCategory(skill.getSkillCategory())
                .build();
    }

    /** 경력 도메인 -> 경력 JPA 엔티티 변환 */
    public PersonalCompanyEntity toEntity(PersonalCompany company) {
        return PersonalCompanyEntity.builder()
                .companyName(company.getCompanyName())
                .startDate(company.getStartDate())
                .endDate(company.getEndDate())
                .build();
    }

    /** 자격증 도메인 -> 자격증 JPA 엔티티 변환 */
    public PersonalCertificateEntity toEntity(PersonalCertificate certificate) {
        return PersonalCertificateEntity.builder()
                .certificateName(certificate.getCertificateName())
                .certificateAcquisitionOrganization(certificate.getCertificateAcquisitionOrganization())
                .certificateAcquisitionDate(certificate.getCertificateAcquisitionDate())
                .build();
    }

    /** 자기소개서 JPA 엔티티 -> 자기소개서 도메인 변환 */
    public Personal toDomain(PersonalEntity personalEntity) {
        if (personalEntity == null) return null;

        List<PersonalAward> personalAwards = new ArrayList<>();
        if (personalEntity.getAwards() != null) {
            personalAwards = personalEntity.getAwards().stream()
                    .map(this::toDomain)
                    .collect(Collectors.toList());
        }

        List<PersonalSkill> personalSkills = new ArrayList<>();
        if (personalEntity.getSkills() != null) {
            personalSkills = personalEntity.getSkills().stream()
                    .map(this::toDomain)
                    .collect(Collectors.toList());
        }

        List<PersonalCompany> personalCompanys = new ArrayList<>();
        if (personalEntity.getCompanies() != null) {
            personalCompanys = personalEntity.getCompanies().stream()
                    .map(this::toDomain)
                    .collect(Collectors.toList());
        }

        List<PersonalCertificate> personalCertificates = new ArrayList<>();
        if (personalEntity.getCertificates() != null) {
            personalCertificates = personalEntity.getCertificates().stream()
            .map(this::toDomain).collect(Collectors.toList());
        }

        return Personal.builder()
                .id(personalEntity.getId())
                .userId(personalEntity.getUserId())
                .name(personalEntity.getName())
                .job(personalEntity.getJob())
                .education(personalEntity.getEducation())
                .gradePointAverage(personalEntity.getGradePointAverage())
                .introduction(personalEntity.getIntroduction())
                .profile_image_id(personalEntity.getProfileImageId())
                .personalAwards(personalAwards)
                .personalSkills(personalSkills)
                .personalCompanys(personalCompanys)
                .personalCertificates(personalCertificates)
                .build();
    }

    // PersonalAwardEntity (JPA) -> PersonalAward (도메인)
    public PersonalAward toDomain(PersonalAwardEntity awardEntity) {
        return PersonalAward.builder()
                .awardName(awardEntity.getAwardName())
                .build();
    }

    // PersonalSkillEntity (JPA) -> PersonalSkill (도메인)
    public PersonalSkill toDomain(PersonalSkillEntity skillEntity) {
        return PersonalSkill.builder()
                .skillName(skillEntity.getSkillName())
                .skillCategory(skillEntity.getSkillCategory())
                .build();
    }

    // PersonalCompanyEntity (JPA) -> PersonalCompany (도메인)
    public PersonalCompany toDomain(PersonalCompanyEntity companyEntity) {
        return PersonalCompany.builder()
                .companyName(companyEntity.getCompanyName())
                .startDate(companyEntity.getStartDate())
                .endDate(companyEntity.getEndDate())
                .build();
    }

    // PersonalCertificateEntity (JPA) -> PersonalCertificate (도메인)
    public PersonalCertificate toDomain(PersonalCertificateEntity certificateEntity) {
        return PersonalCertificate.builder()
                .certificateName(certificateEntity.getCertificateName())
                .certificateAcquisitionOrganization(certificateEntity.getCertificateAcquisitionOrganization())
                .certificateAcquisitionDate(certificateEntity.getCertificateAcquisitionDate())
                .build();
    }
}
