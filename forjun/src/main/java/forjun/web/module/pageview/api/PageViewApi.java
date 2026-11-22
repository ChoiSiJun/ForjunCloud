package forjun.web.module.pageview.api;

import forjun.web.config.security.CustomUserDetail;
import forjun.web.module.pageview.application.PageViewService;
import forjun.web.module.pageview.application.PageViewService.RecordView;
import forjun.web.module.pageview.domain.PublicPage;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PageViewApi {

    private final PageViewService pageViews;

    public record RecordViewRequest(
            @NotBlank @Pattern(regexp = "[0-9a-f]{32}") String eventId,
            @NotBlank @Size(max = 255) String userId,
            @NotBlank @Pattern(regexp = "PERSONAL|SI|SM|RND|TOY") String page
    ) {}

    public record DailyViewsResponse(LocalDate date, long personalViews, long historyViews) {}

    @PostMapping("/api/v1/public-page-views")
    public ResponseEntity<Void> record(
            @AuthenticationPrincipal CustomUserDetail viewer,
            @Valid @RequestBody RecordViewRequest request
    ) {
        Long viewerId = viewer == null ? null : Long.valueOf(viewer.getUsername());
        pageViews.record(new RecordView(request.eventId(), request.userId(), PublicPage.valueOf(request.page()), viewerId));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/v1/dashboard/page-views")
    public ResponseEntity<List<DailyViewsResponse>> summarize(@AuthenticationPrincipal CustomUserDetail owner) {
        var days = pageViews.summarize(Long.parseLong(owner.getUsername())).stream()
                .map(day -> new DailyViewsResponse(day.date(), day.personalViews(), day.historyViews()))
                .toList();
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(days);
    }
}
