package forjun.web.module.profilesummary.application.port.out;

import forjun.web.module.profilesummary.domain.ProfileSummary;
import java.util.Optional;

public interface ProfileSummaryStore {
    Optional<ProfileSummary> find(String userId);
    Optional<ProfileSummary> findPublished(String userId);
    void save(String userId, ProfileSummary summary);
}
