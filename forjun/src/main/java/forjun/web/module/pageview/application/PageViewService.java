package forjun.web.module.pageview.application;

import forjun.web.module.pageview.application.port.out.PageViewStore;
import forjun.web.module.pageview.application.port.out.PageViewStore.DailyViews;
import forjun.web.module.pageview.application.port.out.PublicPageLookup;
import forjun.web.module.pageview.domain.PublicPage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PageViewService {

    private static final ZoneId REPORT_ZONE = ZoneId.of("Asia/Seoul");
    private static final int REPORT_DAYS = 30;

    private final PublicPageLookup publicPages;
    private final PageViewStore views;

    public record RecordView(String eventId, String userId, PublicPage page, Long viewerId) {}

    public void record(RecordView command) {
        long ownerId = publicPages.ownerId(command.userId());
        if (command.viewerId() != null && command.viewerId() == ownerId) {
            return;
        }
        if (publicPages.hasContent(command.userId(), command.page())) {
            views.record(command.eventId(), ownerId, LocalDate.now(REPORT_ZONE), command.page() == PublicPage.PERSONAL);
        }
    }

    public List<DailyViews> summarize(long ownerId) {
        LocalDate today = LocalDate.now(REPORT_ZONE);
        LocalDate firstDay = today.minusDays(REPORT_DAYS - 1);
        var recordedDays = views.findDailyViews(ownerId, firstDay, today).stream()
                .collect(Collectors.toMap(DailyViews::date, Function.identity()));

        return firstDay.datesUntil(today.plusDays(1))
                .map(day -> recordedDays.getOrDefault(day, new DailyViews(day, 0, 0)))
                .toList();
    }
}
