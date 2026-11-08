package forjun.web.module.personal.infrastructure.jpa.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "personal_certificate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalCertificateEntity {

    /** 고유 아이디 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 자기소개서 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private PersonalEntity personal;

    /** 자격증명 */
    private String certificateName;

    /** 자격증 취득 기관 */
    private String certificateAcquisitionOrganization;

    /** 자격증 취득일 */
    private String certificateAcquisitionDate;
}   
