package forjun.web.module.profilesummary.application;

import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.module.profilesummary.application.port.out.ProfileAiKeyCipher;
import forjun.web.module.profilesummary.application.port.out.ProfileAiProvider;
import forjun.web.module.profilesummary.application.port.out.ProfileAiStore;
import forjun.web.module.profilesummary.application.port.out.ProfileAiStore.Settings;
import org.springframework.stereotype.Service;

import java.net.URI;

@Service
public class ProfileAiService {
    public record SettingsView(String baseUrl, String model, boolean hasApiKey) {}

    private final ProfileAiStore store;
    private final ProfileAiKeyCipher cipher;
    private final ProfileAiProvider provider;
    private final ProfileAiProviderUrl providerUrl;

    public ProfileAiService(ProfileAiStore store, ProfileAiKeyCipher cipher,
                            ProfileAiProvider provider, ProfileAiProviderUrl providerUrl) {
        this.store = store;
        this.cipher = cipher;
        this.provider = provider;
        this.providerUrl = providerUrl;
    }

    public SettingsView getSettings(long userId) {
        return store.find(userId).map(saved -> new SettingsView(saved.baseUrl(), saved.model(), true))
                .orElseGet(() -> new SettingsView("", "", false));
    }

    public SettingsView saveSettings(long userId, String baseUrl, String model, String apiKey) {
        String normalized = providerUrl.normalizeForSettings(baseUrl);
        if (model == null || model.isBlank() || model.length() > 200
                || model.chars().anyMatch(Character::isISOControl)) {
            throw AppException.of(ErrorCode.PROFILE_AI_SETTINGS_MODEL_INVALID);
        }
        String trimmedModel = model.strip();
        if (apiKey == null) {
            if (!store.updateModel(userId, normalized, trimmedModel)) {
                throw AppException.of(ErrorCode.PROFILE_AI_SETTINGS_KEY_REQUIRED);
            }
        } else {
            if (apiKey.isEmpty() || apiKey.length() > 2048
                    || apiKey.chars().anyMatch(ch -> ch < 33 || ch > 126)) {
                throw AppException.of(ErrorCode.PROFILE_AI_SETTINGS_KEY_INVALID);
            }
            store.save(userId, new Settings(normalized, trimmedModel, cipher.encrypt(userId, normalized, apiKey)));
        }
        return new SettingsView(normalized, trimmedModel, true);
    }

    public void deleteSettings(long userId) {
        store.delete(userId);
    }

    public void test(long userId) {
        Settings settings = requireSettings(userId);
        URI endpoint = providerUrl.endpoint(settings.baseUrl());
        provider.test(endpoint, settings.model(), cipher.decrypt(userId, settings.baseUrl(), settings.encryptedKey()));
    }

    public ProfileAiDraft generate(long userId, String expectedBaseUrl, String prompt, String targetRole) {
        if (prompt == null || prompt.isBlank() || prompt.length() > 100_000
                || expectedBaseUrl == null || expectedBaseUrl.isBlank() || expectedBaseUrl.length() > 512
                || (targetRole != null && targetRole.length() > 200)) {
            throw invalid();
        }
        Settings settings = requireSettings(userId);
        if (!settings.baseUrl().equals(expectedBaseUrl)) {
            throw AppException.of(ErrorCode.PROFILE_AI_SETTINGS_CHANGED);
        }
        URI endpoint = providerUrl.endpoint(settings.baseUrl());
        return provider.generate(endpoint, settings.model(),
                cipher.decrypt(userId, settings.baseUrl(), settings.encryptedKey()), prompt,
                targetRole == null ? "" : targetRole.strip());
    }

    private Settings requireSettings(long userId) {
        return store.find(userId).orElseThrow(() -> AppException.of(ErrorCode.PROFILE_AI_SETTINGS_REQUIRED));
    }

    private static AppException invalid() {
        return AppException.of(ErrorCode.VALIDATION_FAILED, "profile AI request");
    }
}
