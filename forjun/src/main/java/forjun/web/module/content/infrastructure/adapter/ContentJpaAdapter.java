package forjun.web.module.content.infrastructure.adapter;

import forjun.web.module.content.application.port.ContentPort;
import forjun.web.module.content.domain.Content;
import forjun.web.module.content.infrastructure.repository.jpa.ContentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;



@Repository
@RequiredArgsConstructor
public class ContentJpaAdapter implements ContentPort {

    private final ContentRepo contentRepo;
    @Override
    public void saveContent(Content content) {

    }

    @Override
    public Content getContent(int contentId) {
        return null;
    }

    @Override
    public List<Content> getContents() {

        return null;
    }

    @Override
    public void deleteContent(int contentId) {

    }
}
