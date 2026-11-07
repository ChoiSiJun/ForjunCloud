package forjun.web.module.personal.infrastructure.jpa.entity;

import forjun.web.module.personal.domain.Personal;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "personal")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 사용자 ID */
    @Column(nullable = false , unique = true)
    private String userId; 

    /** 이름 */
    private String name;

    /** 직업 */
    private String job;

    /** 학력 */
    private String education;

    /** 학점 */
    private String gradePointAverage;

    /** 자기소개 */
    private String introduction;

    /** 업로드 파일 식별자 */
    @Column(name = "profile_image_id")
    private String profileImageId;

    // 경력
    @Builder.Default
    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonalCompanyEntity> companies = new ArrayList<>();

    // 스킬
    @Builder.Default
    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonalSkillEntity> skills = new ArrayList<>();

    // 수상
    @Builder.Default
    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonalAwardEntity> awards = new ArrayList<>();

    // 자격증
    @Builder.Default
    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonalCertificateEntity> certificates = new ArrayList<>();

    // ==========================
    // 기능 메서드
    // ==========================

    /** 자기소개서 업데이트 */
    public PersonalEntity update(Personal personal ,
                                 List<PersonalAwardEntity> newAwards,
                                 List<PersonalSkillEntity> newSkills,
                                 List<PersonalCompanyEntity> newCompanies,
                                 List<PersonalCertificateEntity> newCertificates
                                )
    {
        this.name = personal.getName();
        this.job = personal.getJob();
        this.education = personal.getEducation();
        this.gradePointAverage = personal.getGradePointAverage();
        this.introduction = personal.getIntroduction();

        if(personal.getProfile_image_id() != null){
         this.profileImageId = personal.getProfile_image_id();
        }

        this.companies.clear();
        newCompanies.forEach(this::addCompany);

        this.skills.clear();
        newSkills.forEach(this::addSkill);

        this.awards.clear();
        newAwards.forEach(this::addAward);

        this.certificates.clear();
        newCertificates.forEach(this::addCertificate);
        return this;
    }

    // ==========================
    // 연관관계 편의 메서드들
    // ==========================

    /** 경력 추가 */
    public void addCompany(PersonalCompanyEntity company) {
        companies.add(company);
        company.setPersonal(this);
    }

    /** 경력 삭제 */
    public void removeCompany(PersonalCompanyEntity company) {
        companies.remove(company);
        company.setPersonal(null);
    }

    /** 스킬 추가 */
    public void addSkill(PersonalSkillEntity skill) {
        skills.add(skill);
        skill.setPersonal(this);
    }

    /** 스킬 삭제 */
    public void removeSkill(PersonalSkillEntity skill) {
        skills.remove(skill);
        skill.setPersonal(null);
    }

    /** 수상 추가 */
    public void addAward(PersonalAwardEntity award) {
        awards.add(award);
        award.setPersonal(this);
    }

    /** 수상 삭제 */
    public void removeAward(PersonalAwardEntity award) {
        awards.remove(award);
        award.setPersonal(null);
    }

    /** 자격증 추가 */
    public void addCertificate(PersonalCertificateEntity certificate) {
        certificates.add(certificate);
        certificate.setPersonal(this);
    }

    /** 자격증 삭제 */
    public void removeCertificate(PersonalCertificateEntity certificate) {
        certificates.remove(certificate);
        certificate.setPersonal(null);
    }       
}
