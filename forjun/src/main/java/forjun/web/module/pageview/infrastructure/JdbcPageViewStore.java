package forjun.web.module.pageview.infrastructure;

import forjun.web.module.pageview.application.port.out.PageViewStore;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class JdbcPageViewStore implements PageViewStore {

    private final JdbcTemplate jdbc;

    @Override
    public void record(String eventId, long ownerId, LocalDate date, boolean personal) {
        jdbc.update("""
                INSERT INTO public_page_view (event_id, owner_id, view_date, personal)
                VALUES (?, ?, ?, ?)
                ON CONFLICT (event_id) DO NOTHING
                """, eventId, ownerId, date, personal);
    }

    @Override
    public List<DailyViews> findDailyViews(long ownerId, LocalDate firstDay, LocalDate lastDay) {
        return jdbc.query("""
                SELECT view_date, COUNT(*) FILTER (WHERE personal) AS personal_views,
                       COUNT(*) FILTER (WHERE NOT personal) AS history_views
                FROM public_page_view
                WHERE owner_id = ? AND view_date BETWEEN ? AND ?
                GROUP BY view_date
                """, (row, index) -> new DailyViews(
                row.getObject("view_date", LocalDate.class),
                row.getLong("personal_views"),
                row.getLong("history_views")
        ), ownerId, firstDay, lastDay);
    }
}
