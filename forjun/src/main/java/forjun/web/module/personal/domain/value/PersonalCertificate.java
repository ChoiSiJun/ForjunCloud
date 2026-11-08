

package forjun.web.module.personal.domain.value;

import lombok.Builder;
import lombok.Getter;

/** 자기소개서 자격증 */
@Getter
@Builder
public class PersonalCertificate {

    /** 자격증명 */
    private String certificateName;
    
    /** 자격증 취득 기관 */
    private String certificateAcquisitionOrganization;

    /** 자격증 취득일 */
    private String certificateAcquisitionDate;
}
