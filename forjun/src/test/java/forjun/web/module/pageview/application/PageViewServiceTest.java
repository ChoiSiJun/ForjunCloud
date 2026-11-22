package forjun.web.module.pageview.application;

import forjun.web.module.pageview.application.PageViewService.RecordView;
import forjun.web.module.pageview.application.port.out.PageViewStore;
import forjun.web.module.pageview.application.port.out.PageViewStore.DailyViews;
import forjun.web.module.pageview.application.port.out.PublicPageLookup;
import forjun.web.module.pageview.domain.PublicPage;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class PageViewServiceTest {

    private final PublicPageLookup pages = mock(PublicPageLookup.class);
    private final PageViewStore views = mock(PageViewStore.class);
    private final PageViewService service = new PageViewService(pages, views);

    @Test
    void skipsTheOwnerAndEmptyPages() {
        when(pages.ownerId("owner")).thenReturn(5L);

        service.record(new RecordView("owner-event", "owner", PublicPage.PERSONAL, 5L));
        service.record(new RecordView("empty-event", "owner", PublicPage.TOY, null));

        verifyNoInteractions(views);
    }

    @Test
    void recordsViewsOfPublicContentByOtherVisitors() {
        when(pages.ownerId("owner")).thenReturn(5L);
        when(pages.hasContent("owner", PublicPage.PERSONAL)).thenReturn(true);
        when(pages.hasContent("owner", PublicPage.SI)).thenReturn(true);

        service.record(new RecordView("personal-event", "owner", PublicPage.PERSONAL, null));
        service.record(new RecordView("history-event", "owner", PublicPage.SI, 9L));

        verify(views).record(eq("personal-event"), eq(5L), any(LocalDate.class), eq(true));
        verify(views).record(eq("history-event"), eq(5L), any(LocalDate.class), eq(false));
    }

    @Test
    void fillsMissingDaysAndRetainsTheCountsForTheRequestedOwner() {
        when(views.findDailyViews(eq(5L), any(LocalDate.class), any(LocalDate.class)))
                .thenAnswer(call -> List.of(new DailyViews(call.getArgument(2), 2, 3)));

        List<DailyViews> days = service.summarize(5L);

        assertThat(days).hasSize(30);
        assertThat(days.get(0).date()).isEqualTo(days.get(29).date().minusDays(29));
        assertThat(days.subList(0, 29)).allMatch(day -> day.personalViews() == 0 && day.historyViews() == 0);
        assertThat(days.get(29).personalViews()).isEqualTo(2);
        assertThat(days.get(29).historyViews()).isEqualTo(3);
    }
}
