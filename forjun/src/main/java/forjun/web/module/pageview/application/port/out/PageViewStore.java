package forjun.web.module.pageview.application.port.out;

import java.time.LocalDate;
import java.util.List;

public interface PageViewStore {

    record DailyViews(LocalDate date, long personalViews, long historyViews) {}

    void record(String eventId, long ownerId, LocalDate date, boolean personal);

    List<DailyViews> findDailyViews(long ownerId, LocalDate firstDay, LocalDate lastDay);
}
