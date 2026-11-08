package forjun.web.module.personal.api.mapper;

import forjun.web.module.personal.api.dto.PersonalDetailResponse;
import forjun.web.module.personal.api.dto.SavePersonalRequest;
import forjun.web.module.personal.application.port.in.dto.SavePersonalCommand;
import forjun.web.module.personal.domain.Personal;
import forjun.web.module.personal.application.port.in.dto.PersonalView;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/** 자기소개서 API Mapper */

@Component
public class PersonalApiMapper {


    /** 자기소개서 도메인 변환 */
    public SavePersonalCommand toSavePersonalCommand(String userId, SavePersonalRequest request) {
        
        List<SavePersonalCommand.PersonalAward> awards = new ArrayList<>();
        List<SavePersonalCommand.PersonalSkill> skills = new ArrayList<>();
        List<SavePersonalCommand.PersonalCompany> companies = new ArrayList<>();
        List<SavePersonalCommand.PersonalCertificate> certificates = new ArrayList<>();

        // Awards
        request.awards().forEach(a -> awards.add(new SavePersonalCommand.PersonalAward(a.awardName())));

        // Skills
        request.skills().forEach(s -> skills.add(new SavePersonalCommand.PersonalSkill(s.skillName(), s.skillCategory())));

        // Companies
        request.companies().forEach(c -> companies.add(new SavePersonalCommand.PersonalCompany(c.companyName(), c.startDate(), c.endDate())));

        // Certificates
        request.certificates().forEach(c -> certificates.add(new SavePersonalCommand.PersonalCertificate(c.certificateName(), c.certificateAcquisitionOrganization(), c.certificateAcquisitionDate())));

        return new SavePersonalCommand(userId, request.job(), request.name(), request.education(), request.gradePointAverage(), request.introduction(), request.profile_image_id(), awards, skills, companies, certificates);
    }


    /** 자기소개서 상세 응답 DTO 변환 */
    public PersonalDetailResponse toPersonalResponseDto(PersonalView view) {

        // 자기소개서가 없으면 null 반환
        if(view == null){
            return null;
        }
        Personal personal = view.personal();

        // 수상 리스트
        List<PersonalDetailResponse.PersonalAwardResponse> awardList = new ArrayList<>();
        // 경력 리스트
        List<PersonalDetailResponse.PersonalCompanyResponse> companyList = new ArrayList<>();
        // 스킬 리스트
        List<PersonalDetailResponse.PersonalSkillResponse> skillList = new ArrayList<>();
        // 자격증 리스트
        List<PersonalDetailResponse.PersonalCertificateResponse> certificateList = new ArrayList<>();

        // 수상 리스트 추가
        personal.getPersonalAwards().forEach(award -> {
            awardList.add(
                new PersonalDetailResponse.PersonalAwardResponse(
                        award.getAwardName()));
        });

        // 스킬 리스트 추가
        personal.getPersonalSkills().forEach(skill -> {
            skillList.add(
                new PersonalDetailResponse.PersonalSkillResponse(
                        skill.getSkillName(),
                        skill.getSkillCategory()));
        });

        // 경력 리스트 추가
        personal.getPersonalCompanys().forEach(company -> {
            companyList.add(
                new PersonalDetailResponse.PersonalCompanyResponse(
                        company.getCompanyName(),
                        company.getStartDate(),
                        company.getEndDate()));
        });

        // 자격증 리스트 추가
        personal.getPersonalCertificates().forEach(certificate -> {
            certificateList.add(
                new PersonalDetailResponse.PersonalCertificateResponse(
                        certificate.getCertificateName(),
                        certificate.getCertificateAcquisitionOrganization(),
                        certificate.getCertificateAcquisitionDate()));
        });


        return new PersonalDetailResponse(
            personal.getId(),
            personal.getName(),
            personal.getJob(),
            personal.getEducation(),
            personal.getGradePointAverage(),
            personal.getIntroduction(),
            view.profileImageUrl(),
            personal.getProfile_image_id(),
            awardList,
            companyList,
            skillList,
            certificateList
        );
    }
}
