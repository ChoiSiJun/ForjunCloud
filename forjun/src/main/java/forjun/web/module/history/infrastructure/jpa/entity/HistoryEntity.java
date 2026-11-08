package forjun.web.module.history.infrastructure.jpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="history")
public class HistoryEntity {

    @Id
    @GeneratedValue
    private Integer id;

    private String userId;

    private String category;

    private String project;

    private String subject;

    private String description;

    @Builder.Default
    @OneToMany(mappedBy = "history", cascade = CascadeType.ALL , orphanRemoval = true)
    private List<HistorySkillEntity> historySkill = new ArrayList<>();

    private LocalDate historyStartDate;

    private LocalDate  historyEndDate;

    public void addHistorySkill(HistorySkillEntity skill) {
        historySkill.add(skill);
        skill.setHistory(this);
    }

    public void updateHistory(String category, String project, String subject, String description, LocalDate historyStartDate, LocalDate historyEndDate, List<HistorySkillEntity> skillEntities) {
        this.category = category;
        this.project = project;
        this.subject = subject;
        this.description = description;
        this.historyStartDate = historyStartDate;
        this.historyEndDate = historyEndDate;

        // 기존의 historySkill 리스트를 모두 비워서 고아(orphan)로 만들어 삭제되도록 함
        this.historySkill.clear();

        //historySkill 재추가
        if (skillEntities != null) {
            skillEntities.forEach(this::addHistorySkill); // 새 스킬 추가
        }
    }
}
