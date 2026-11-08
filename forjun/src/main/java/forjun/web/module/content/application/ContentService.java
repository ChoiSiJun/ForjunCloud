package forjun.web.module.content.application;

import forjun.web.module.content.infrastructure.adapter.ContentJpaAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional
public class ContentService
{
    private final ContentJpaAdapter contentJpaAdapter;

}
