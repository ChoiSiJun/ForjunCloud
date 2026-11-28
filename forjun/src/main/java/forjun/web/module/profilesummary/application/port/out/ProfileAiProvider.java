package forjun.web.module.profilesummary.application.port.out;

import forjun.web.module.profilesummary.application.ProfileAiDraft;
import java.net.URI;

public interface ProfileAiProvider {
    void test(URI endpoint, String model, String key);
    ProfileAiDraft generate(URI endpoint, String model, String key, String prompt, String targetRole);
}
