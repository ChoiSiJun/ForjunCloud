package forjun.web.module.personal.infrastructure.jpa.repository;

import forjun.web.module.personal.infrastructure.jpa.entity.PersonalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonalRepository extends JpaRepository<PersonalEntity , Long> {
    public Optional<PersonalEntity> findByUserId(String userId);
}
