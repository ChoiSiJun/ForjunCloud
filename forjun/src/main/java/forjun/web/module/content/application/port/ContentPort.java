package forjun.web.module.content.application.port;

import forjun.web.module.content.domain.Content;

import java.util.List;

public interface ContentPort {

    //콘텐츠 저장
    public void saveContent(Content content);

    //콘텐츠 가져오기
    public Content getContent(int contentId);

    //콘텐츠 리스트 가져오기
    public List<Content> getContents();

    //콘텐츠 삭제하기
    public void deleteContent(int contentId);
}
