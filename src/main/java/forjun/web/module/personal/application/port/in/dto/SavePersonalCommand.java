package forjun.web.module.personal.application.port.in.dto;

import java.util.List;

/** 자기소개서 저장 명령 */
public record SavePersonalCommand(

    /** 사용자 ID */
    String userId, 
    /** 직업 */
    String job, 
    /** 이름 */
    String name, 
    /** 학력 */
    String education,
    /** 학점 */
    String gradePointAverage,
    /** 자기소개 */
    String introduction,
    /** 업로드 응답의 fileId */
    String profile_image_id,
    /** 수상 명령 */
    List<PersonalAward> awards, 
    /** 스킬 명령 */
    List<PersonalSkill> skills, 
    /** 경력 명령 */
    List<PersonalCompany> companies,

    /** 자격증 명령 */
    List<PersonalCertificate> certificates
) {

    /** 수상 명령 */
    public static record PersonalAward(String awardName) {}
    /** 스킬 명령 */
    public static record PersonalSkill(String skillName, String skillCategory) {}
    /** 경력 명령 */
    public static record PersonalCompany(String companyName, String startDate, String endDate) {}

    /** 자격증 명령 */
    public static record PersonalCertificate(String certificateName, String certificateAcquisitionOrganization, String certificateAcquisitionDate) {}

}
