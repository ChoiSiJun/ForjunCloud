package forjun.web.module.profilesummary.application;

import forjun.web.exception.AppException;
import forjun.web.module.profilesummary.application.port.out.ProfileAiKeyCipher;
import forjun.web.module.profilesummary.application.port.out.ProfileAiProvider;
import forjun.web.module.profilesummary.application.port.out.ProfileAiStore;
import forjun.web.module.profilesummary.application.port.out.ProfileAiStore.Settings;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.net.URI;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class ProfileAiServiceTest {
    private static final String BASE = "https://api.openai.com/v1";
    private static final String GEMINI = "https://generativelanguage.googleapis.com/v1beta/openai";
    private final ProfileAiStore store = mock(ProfileAiStore.class);
    private final ProfileAiKeyCipher cipher = mock(ProfileAiKeyCipher.class);
    private final ProfileAiProvider provider = mock(ProfileAiProvider.class);
    private final ProfileAiProviderUrl url = new ProfileAiProviderUrl("provider.example.com");
    private final ProfileAiService service = new ProfileAiService(store, cipher, provider, url);

    @Test
    void settingsVisibilityAndKeyReuseAreScopedToCurrentUserAndUrl() {
        when(store.find(43L)).thenReturn(Optional.empty());
        assertThat(service.getSettings(43L)).isEqualTo(new ProfileAiService.SettingsView("", "", false));

        when(store.updateModel(42L, BASE, "new-model")).thenReturn(true);
        assertThat(service.saveSettings(42L, "HTTPS://API.OPENAI.COM:443/v1/", " new-model ", null))
                .isEqualTo(new ProfileAiService.SettingsView(BASE, "new-model", true));
        assertThatThrownBy(() -> service.saveSettings(42L, "https://provider.example.com/v1", "new-model", null))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "PROFILE_AI_SETTINGS_KEY_REQUIRED");
        verifyNoInteractions(cipher);
    }

    @Test
    void testAndGenerateUseSavedCredentialsAndGenerationReceivesOnlySubmittedMaterial() {
        when(store.find(42L)).thenReturn(Optional.of(new Settings(BASE, "model", "ciphertext")));
        when(cipher.decrypt(42L, BASE, "ciphertext")).thenReturn("test-key");
        service.test(42L);
        service.generate(42L, BASE, "material", " role ");
        URI endpoint = URI.create(BASE + "/chat/completions");
        verify(provider).test(endpoint, "model", "test-key");
        verify(provider).generate(endpoint, "model", "test-key", "material", "role");
        verify(store, times(2)).find(42L);
        verifyNoMoreInteractions(store);
    }

    @Test
    void missingSettingsAndInvalidInputDoNotUseProvider() {
        assertThatThrownBy(() -> service.test(43L)).isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", "PROFILE_AI_SETTINGS_REQUIRED");
        assertThatThrownBy(() -> service.generate(42L, BASE, "x".repeat(100001), null))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "VALIDATION_FAILED");
        verifyNoInteractions(provider, cipher);
    }

    @Test
    void changedDestinationDoesNotDecryptKeyOrSendMaterial() {
        when(store.find(42L)).thenReturn(Optional.of(new Settings("https://provider.example.com/v1",
                "model", "ciphertext")));
        assertThatThrownBy(() -> service.generate(42L, BASE, "material", null))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "PROFILE_AI_SETTINGS_CHANGED");
        verifyNoInteractions(provider, cipher);
    }

    @ParameterizedTest
    @ValueSource(strings = {GEMINI, GEMINI + "/", "HTTPS://GENERATIVELANGUAGE.GOOGLEAPIS.COM:443/v1beta/openai/"})
    void permitsOfficialGeminiEndpointWithoutAnOperatorAllowlist(String value) {
        var defaultUrls = new ProfileAiProviderUrl("");
        assertThat(defaultUrls.normalize(value)).isEqualTo(GEMINI);
        assertThat(defaultUrls.endpoint(value)).isEqualTo(URI.create(GEMINI + "/chat/completions"));
    }

    @Test
    void preservesCanonicalOpenAiAndCustomAllowlist() {
        assertThat(url.normalize("https://api.openai.com")).isEqualTo(BASE);
        assertThat(url.normalize("https://provider.example.com/custom/v1/"))
                .isEqualTo("https://provider.example.com/custom/v1");
        assertThatThrownBy(() -> new ProfileAiProviderUrl("").normalize("https://provider.example.com/custom/v1"))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "VALIDATION_FAILED");
    }

    @Test
    void preservesExistingCustomGeminiPathWithExplicitOperatorAllowlist() {
        var configuredUrls = new ProfileAiProviderUrl("generativelanguage.googleapis.com,api.openai.com");
        assertThat(configuredUrls.normalize("https://generativelanguage.googleapis.com/custom/v1/"))
                .isEqualTo("https://generativelanguage.googleapis.com/custom/v1");
        assertThatThrownBy(() -> configuredUrls.normalize("https://api.openai.com/custom/v1"))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "VALIDATION_FAILED");
    }

    @ParameterizedTest
    @ValueSource(strings = {"http://api.openai.com/v1", "https://api.openai.com.attacker.example/v1",
            "https://api.openai.com./v1", "https://api.openai.com:444/v1", "https://api.openai.com:0443/v1",
            "https://other@api.openai.com/v1", "https://api.openai.com/v1?x=y",
            "https://api.openai.com/v1#x", "https://provider.example.com/v1/%2F",
            "https://provider.example.com/v1/../x", "https://127.0.0.1/v1",
            "https://generativelanguage.googleapis.com", "https://generativelanguage.googleapis.com/v1",
            GEMINI + "/chat/completions", GEMINI + "?x=y", GEMINI + "#x",
            "https://generativelanguage.googleapis.com:444/v1beta/openai",
            "https://generativelanguage.googleapis.com.attacker.example/v1beta/openai"})
    void rejectsUnsafeOrNonAllowlistedUrls(String value) {
        assertThatThrownBy(() -> url.normalize(value)).isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", "VALIDATION_FAILED");
    }
}
