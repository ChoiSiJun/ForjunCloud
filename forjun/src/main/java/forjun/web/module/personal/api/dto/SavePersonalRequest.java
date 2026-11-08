package forjun.web.module.personal.api.dto;

import java.util.List;
// Lombok 어노테이션 불필요

/** 자기소개서 저장 요청 DTO */
public record SavePersonalRequest(
    //자기소개서 고유 아이디
    Long id,
    //자기소개서 직업
    String job,
    //자기소개서 이름
    String name,
    //자기소개서 학력
    String education,
    //자기소개서 학점
    String gradePointAverage,
    //자기소개서 자기소개
    String introduction,
    //자기소개서 프로필 이미지
    String profile_image_id,
    //자기소개서 수상
    List<PersonalAwardRequest> awards,
    //자기소개서 경력
    List<PersonalCompanyRequest> companies,
    //자기소개서 스킬
    List<PersonalSkillRequest> skills,
    //자기소개서 자격증
    List<PersonalCertificateRequest> certificates
) {
  
    /** 자기소개서 수상 요청 Record  */
    public static record PersonalAwardRequest(String awardName) {}

    /** 자기소개서 경력 요청 Record  */
    public static record PersonalCompanyRequest(
        String companyName,
        String startDate,
        String endDate
    ) {}

    /** 자기소개서 스킬 요청 Record  */
    public static record PersonalSkillRequest(String skillName, String skillCategory) {}

    /** 자기소개서 자격증 요청 Record  */
    public static record PersonalCertificateRequest(
        String certificateName, 
        String certificateAcquisitionOrganization, 
        String certificateAcquisitionDate) {}
}