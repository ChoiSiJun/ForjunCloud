package forjun.web.module.personal.application.port.out;

import forjun.web.module.personal.domain.Personal;

import java.util.Optional;

public interface PersonalJpaPort {

    /** 자기소개서 저장 */
    public void savePersonal(Personal personal);

    /** 자기소개서 조회 */
    public Optional<Personal> getPersonal(String userId);
}
