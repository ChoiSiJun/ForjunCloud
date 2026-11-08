package forjun.web.module.history.infrastructure.jpa.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="history_skill")
public class HistorySkillEntity {

    @Id
    @GeneratedValue
    private int id;

    @ManyToOne
    @Setter(AccessLevel.PROTECTED)
    @JoinColumn(name="history_id")
    private HistoryEntity history;

    private String skill;

}
