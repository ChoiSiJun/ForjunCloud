package forjun.web.module.content.infrastructure.repository.jpa;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Table(name="content")
public class ContentEntity {

    @Id
    @GeneratedValue

    @Column(name = "content_id")
    private int id;

    private String contentType;

    private String title;

    private String content;

    private String author;

    private LocalDateTime newDate;

    private LocalDateTime editDate;

    public void updateContent(String contentType , String title, String content, String author){

        if(contentType != null && contentType.isEmpty()){
            this.contentType = contentType;
        }

        if(title != null && title.isEmpty()){
            this.title = title;
        }

        if(content != null && content.isEmpty()){
            this.content = content;
        }
        if(author != null && author.isEmpty()){
            this.author = author;
        }
        this.editDate = LocalDateTime.now();
    }
}
