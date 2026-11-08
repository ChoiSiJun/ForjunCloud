package forjun.web.module.content.domain;

import forjun.web.module.content.infrastructure.repository.jpa.ContentEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class Content {

    private int id;

    private String contentType;

    private String title;

    private String content;

    private String author;

    private LocalDateTime newDate;

    private LocalDateTime editDate;

    public static Content fromEntity(ContentEntity contentEntity) {

        return Content.builder()
                .id(contentEntity.getId())
                .contentType(contentEntity.getContentType())
                .title(contentEntity.getTitle())
                .content(contentEntity.getContent())
                .author(contentEntity.getAuthor())
                .newDate(contentEntity.getNewDate())
                .editDate(contentEntity.getEditDate())
                .build();
    }

    public ContentEntity toEntity(){
        return ContentEntity.builder()
                .id(this.id)
                .contentType(this.contentType)
                .title(this.title)
                .author(this.author)
                .content(this.content)
                .build();
    }
}


