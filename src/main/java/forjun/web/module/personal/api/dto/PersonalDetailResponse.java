package forjun.web.module.personal.api.dto;

import java.util.List;

/** 자기소개서 상세 응답 DTO */
public record PersonalDetailResponse(
    //고유 아이디   
    Long id,
    //직업
    String job,
    //이름
    String name,
    //학력
    String education,
    //학점
    String gradePointAverage,
    //자기소개
    String introduction,
    //프로필 이미지
    String profileImageUrl,
    String profileImageId,
    //수상  
    List<PersonalAwardResponse> awards,
    //경력
    List<PersonalCompanyResponse> companies,
    //스킬
    List<PersonalSkillResponse> skills,

    //자격증
    List<PersonalCertificateResponse> certificates
) {


    /** 수상 응답 DTO */
    public static record PersonalAwardResponse(String awardName) {}

    /** 경력 응답 DTO */
    public static record PersonalCompanyResponse(
        String companyName,
        String startDate,
        String endDate
    ) {}

    /** 스킬 응답 DTO */
    public static record PersonalSkillResponse(String skillName, String skillCategory) {}

    /** 자격증 응답 DTO */
    public static record PersonalCertificateResponse(String certificateName, String certificateAcquisitionOrganization, String certificateAcquisitionDate) {}
}
