package forjun.web.module.history.infrastructure.jpa;

import forjun.web.module.history.application.port.out.HistoryJpaPort;
import forjun.web.module.history.domain.History;
import forjun.web.module.history.infrastructure.jpa.entity.HistoryEntity;
import forjun.web.module.history.infrastructure.jpa.mapper.HistoryEntityMapper;
import forjun.web.module.history.infrastructure.jpa.repository.HistoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class HistoryJpaAdapter implements HistoryJpaPort {

    private final HistoryEntityMapper historyEntityMapper;
    private final HistoryRepository historyRepository;

    @Override
    public void saveHistory(History history) {

        HistoryEntity historyEntity = historyEntityMapper.toEntity(history);
        historyRepository.save(historyEntity);
    }

    @Override
    public void updateHistory(History history) {

        HistoryEntity historyEntity = historyRepository.findById(history.getId())
                .orElseThrow(EntityNotFoundException::new);

        // 매핑된 정보를 사용해서 기존 엔티티를 업데이트
        historyEntityMapper.updateHistoryEntity(history, historyEntity);
    }


    @Override
    public Optional<History> getHistory(Integer historyId) {
        return historyRepository.findById(historyId)
                .map(historyEntityMapper::toDomain);
    }

    @Override
    public List<History> getHistorys(String category , String userId) {
        return historyEntityMapper.toDomains(historyRepository.findByCategoryAndUserIdOrderByHistoryStartDateDesc(category , userId));
    }

    @Override
    public void deleteHistory(int historyId) {
        historyRepository.deleteById(historyId);
    }

    @Override
    public boolean existsHistory(Integer historyId) {
        return historyRepository.existsById(historyId);
    }
}
