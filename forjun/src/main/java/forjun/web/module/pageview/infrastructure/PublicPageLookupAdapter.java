package forjun.web.module.pageview.infrastructure;

import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.module.history.application.port.in.HistoryQuery;
import forjun.web.module.history.application.port.in.dto.GetPublicHistorysQuery;
import forjun.web.module.pageview.application.port.out.PublicPageLookup;
import forjun.web.module.pageview.domain.PublicPage;
import forjun.web.module.personal.application.port.in.PersonalQuery;
import forjun.web.module.personal.application.port.in.dto.GetPublicPersonalQuery;
import forjun.web.module.user.application.port.in.UserQuery;
import forjun.web.module.user.application.port.in.dto.GetUserInfoByUserIdQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PublicPageLookupAdapter implements PublicPageLookup {

    private final UserQuery users;
    private final PersonalQuery personal;
    private final HistoryQuery history;

    @Override
    public long ownerId(String userId) {
        var owner = users.getUserByUserId(new GetUserInfoByUserIdQuery(userId));
        if (owner == null) {
            throw AppException.of(ErrorCode.USER_NOT_FOUND, userId);
        }
        return owner.getId();
    }

    @Override
    public boolean hasContent(String userId, PublicPage page) {
        if (page == PublicPage.PERSONAL) {
            return personal.getPublicPersonal(new GetPublicPersonalQuery(userId)) != null;
        }
        return !history.getPublicHistorys(new GetPublicHistorysQuery(page.name(), userId)).isEmpty();
    }
}
