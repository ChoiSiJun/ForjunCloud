package forjun.web.module.pageview.application.port.out;

import forjun.web.module.pageview.domain.PublicPage;

public interface PublicPageLookup {

    long ownerId(String userId);

    boolean hasContent(String userId, PublicPage page);
}
