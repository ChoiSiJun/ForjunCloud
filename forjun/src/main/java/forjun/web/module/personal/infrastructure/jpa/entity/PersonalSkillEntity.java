package forjun.web.module.personal.infrastructure.jpa.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "personal_skill")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalSkillEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private PersonalEntity personal;

    private String skillName;
    private String skillCategory;
}
