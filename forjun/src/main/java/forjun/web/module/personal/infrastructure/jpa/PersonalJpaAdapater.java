package forjun.web.module.personal.infrastructure.jpa;

import forjun.web.module.personal.application.port.out.PersonalJpaPort;
import forjun.web.module.personal.domain.Personal;
import forjun.web.module.personal.infrastructure.jpa.entity.PersonalAwardEntity;
import forjun.web.module.personal.infrastructure.jpa.entity.PersonalCertificateEntity;
import forjun.web.module.personal.infrastructure.jpa.entity.PersonalCompanyEntity;
import forjun.web.module.personal.infrastructure.jpa.entity.PersonalEntity;
import forjun.web.module.personal.infrastructure.jpa.entity.PersonalSkillEntity;
import forjun.web.module.personal.infrastructure.jpa.mapper.PersonalEntityMapper;
import forjun.web.module.personal.infrastructure.jpa.repository.PersonalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PersonalJpaAdapater implements PersonalJpaPort {

    private final PersonalEntityMapper personalEntityMapper;
    private final PersonalRepository personalRepository;

    @Override
    public void savePersonal(Personal personal) {

        PersonalEntity origin_personalEntity = personalRepository.findByUserId(personal.getUserId()).orElse(null);

        // 자기소개서 존재 여부 확인
        if(origin_personalEntity != null) {

            List<PersonalAwardEntity> personalAwardEntityList = personal.getPersonalAwards().stream().map(
                    personalEntityMapper::toEntity
            ).toList();

            List<PersonalSkillEntity> personalSkillEntityList = personal.getPersonalSkills().stream().map(
                    personalEntityMapper::toEntity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
            ).toList();

            List<PersonalCompanyEntity> personalCompanyEntityList = personal.getPersonalCompanys().stream().map(
                    personalEntityMapper::toEntity
            ).toList();

            List<PersonalCertificateEntity> personalCertificateEntityList = personal.getPersonalCertificates().stream().map(
                    personalEntityMapper::toEntity
            ).toList();

            origin_personalEntity.update(personal,personalAwardEntityList,personalSkillEntityList,personalCompanyEntityList,personalCertificateEntityList);

        }else{
            PersonalEntity personalEntity = personalEntityMapper.toEntity(personal);
            personalRepository.save(personalEntity);
        }
    }

    @Override
    public Optional<Personal> getPersonal(String userId) {
        return personalRepository.findByUserId(userId).map(
                personalEntityMapper::toDomain
        );
    }
}
