package forjun.web.module.profilesummary.api;

import forjun.web.config.security.CustomUserDetail;
import forjun.web.module.profilesummary.application.ProfileSummaryService;
import forjun.web.module.profilesummary.domain.ProfileSummary;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class ProfileSummaryApi {
    private final ProfileSummaryService service;

    public record StrengthPayload(@NotBlank @Size(max = 100) String title,
                                  @NotBlank @Size(max = 600) String evidence) {}

    public record SummaryPayload(
            @NotBlank @Size(max = 200) String headline,
            @NotNull @Size(min = 1, max = 3) List<@NotNull @Valid StrengthPayload> strengths,
            @NotBlank @Size(max = 2000) String workingStyle,
            @NotBlank @Size(max = 2000) String representativeExperience,
            @NotNull Boolean published
    ) {
        ProfileSummary toDomain() {
            return new ProfileSummary(headline, strengths.stream()
                    .map(item -> new ProfileSummary.Strength(item.title(), item.evidence())).toList(),
                    workingStyle, representativeExperience, published);
        }

        static SummaryPayload fromDomain(ProfileSummary summary) {
            return new SummaryPayload(summary.headline(), summary.strengths().stream()
                    .map(item -> new StrengthPayload(item.title(), item.evidence())).toList(),
                    summary.workingStyle(), summary.representativeExperience(), summary.published());
        }
    }

    @GetMapping("/api/v1/profile-summary")
    public ResponseEntity<SummaryPayload> own(@AuthenticationPrincipal CustomUserDetail user) {
        return respond(service.getOwnSummary(user.getUserId()));
    }

    @PutMapping("/api/v1/profile-summary")
    public ResponseEntity<Void> save(@AuthenticationPrincipal CustomUserDetail user,
                                     @Valid @RequestBody SummaryPayload payload) {
        service.saveOwnSummary(user.getUserId(), payload.toDomain());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/v1/public-profile-summary/{userId}")
    public ResponseEntity<SummaryPayload> published(@PathVariable String userId) {
        return respond(service.getPublicSummary(userId));
    }

    private ResponseEntity<SummaryPayload> respond(Optional<ProfileSummary> summary) {
        return summary.map(value -> ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .body(SummaryPayload.fromDomain(value)))
                .orElseGet(() -> ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build());
    }
}
