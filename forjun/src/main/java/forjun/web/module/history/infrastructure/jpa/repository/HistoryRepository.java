package forjun.web.module.history.infrastructure.jpa.repository;

import forjun.web.module.history.infrastructure.jpa.entity.HistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface HistoryRepository extends JpaRepository<HistoryEntity, Integer> {
    
    //카테고리 , 이용자 정보로 히스토리 이력 가져오기
    List<HistoryEntity> findByCategoryAndUserIdOrderByHistoryStartDateDesc(String category, String userId);
}



