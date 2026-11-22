package forjun.web.module.profilesummary.application;

import forjun.web.module.profilesummary.application.port.out.ProfileSummaryStore;
import forjun.web.module.profilesummary.domain.ProfileSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileSummaryService {
    private final ProfileSummaryStore store;

    public Optional<ProfileSummary> getOwnSummary(String ownerId) {
        return store.find(ownerId);
    }

    public Optional<ProfileSummary> getPublicSummary(String userId) {
        return store.findPublished(userId);
    }

    public void saveOwnSummary(String ownerId, ProfileSummary summary) {
        store.save(ownerId, summary);
    }
}
