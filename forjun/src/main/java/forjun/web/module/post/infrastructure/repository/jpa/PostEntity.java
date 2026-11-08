package forjun.web.module.post.infrastructure.repository.jpa;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="post")
public class PostEntity {

    @Id
    @GeneratedValue
    @Column(name = "post_id")
    private int id;

    //게시글
    private String title;

    //내용
    private String content;
    
    //작성자
    private String author;

    //작성일
    private LocalDateTime newDate;

    //수정일
    private LocalDateTime editedDate;
    
}
