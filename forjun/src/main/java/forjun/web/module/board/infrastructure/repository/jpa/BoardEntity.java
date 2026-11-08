package forjun.web.module.board.infrastructure.repository.jpa;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="board")
public class BoardEntity {
    
    @Id
    @GeneratedValue
    @Column(name = "board_id")
    private int id;

    //게시판 코드
    private String boardCode;

    //게시판 이름
    private String boardName;

    //게시판 스킨
    private String boardSkin;
}
