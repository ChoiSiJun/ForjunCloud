package forjun.web.module.profilesummary.domain;

import java.util.List;

public record ProfileSummary(String headline, List<Strength> strengths, String workingStyle,
                             String representativeExperience, boolean published) {
    public record Strength(String title, String evidence) {}
}
