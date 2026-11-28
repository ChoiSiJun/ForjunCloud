package forjun.web.module.profilesummary.application;

import java.util.List;

public record ProfileAiDraft(String headline, List<Strength> strengths, String workingStyle,
                             String representativeExperience, String resumeSummary, Swot swot) {
    public record Strength(String title, String evidence) {}

    public record Swot(List<String> strengths, List<String> weaknesses,
                       List<String> opportunities, List<String> threats) {}
}
