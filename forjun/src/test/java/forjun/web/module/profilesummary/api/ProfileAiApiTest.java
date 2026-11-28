package forjun.web.module.profilesummary.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import forjun.web.config.security.CustomUserDetail;
import forjun.web.exception.GlobalExceptionHandler;
import forjun.web.module.profilesummary.application.ProfileAiDraft;
import forjun.web.module.profilesummary.application.ProfileAiProviderUrl;
import forjun.web.module.profilesummary.application.ProfileAiService;
import forjun.web.module.profilesummary.application.ProfileAiService.SettingsView;
import forjun.web.module.profilesummary.application.port.out.ProfileAiKeyCipher;
import forjun.web.module.profilesummary.application.port.out.ProfileAiProvider;
import forjun.web.module.profilesummary.application.port.out.ProfileAiStore;
import forjun.web.module.profilesummary.application.port.out.ProfileAiStore.Settings;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProfileAiApiTest {
    private static final String BASE = "/api/v1/profile-summary";
    private static final String GEMINI = "https://generativelanguage.googleapis.com/v1beta/openai";
    private final ProfileAiService service = mock(ProfileAiService.class);
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new ProfileAiApi(service, new ObjectMapper()))
            .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();

    @BeforeEach
    void authenticate() {
        var user = CustomUserDetail.builder().id(42L).userId("owner").build();
        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated(user, null, List.of()));
    }

    @AfterEach
    void clearAuthentication() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void settingsAndConnectionUseAuthenticatedUserWithWriteOnlyKey() throws Exception {
        String url = "https://api.openai.com/v1";
        when(service.getSettings(42L)).thenReturn(new SettingsView("", "", false));
        when(service.saveSettings(42L, url, "model", "private-key")).thenReturn(new SettingsView(url, "model", true));
        mvc.perform(get(BASE + "/ai-settings"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.hasApiKey").value(false));
        mvc.perform(put(BASE + "/ai-settings").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"baseUrl\":\"" + url + "\",\"model\":\"model\",\"apiKey\":\"private-key\"}"))
                .andExpect(status().isOk()).andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(jsonPath("$.hasApiKey").value(true)).andExpect(jsonPath("$.apiKey").doesNotExist());
        mvc.perform(post(BASE + "/ai-settings/test")).andExpect(status().isNoContent());
        mvc.perform(delete(BASE + "/ai-settings")).andExpect(status().isNoContent());
        verify(service).test(42L);
        verify(service).deleteSettings(42L);
    }

    @Test
    void generatesDraftForConfirmedDestination() throws Exception {
        String url = "https://api.openai.com/v1";
        var swot = new ProfileAiDraft.Swot(List.of("강점"), List.of("약점"), List.of("기회"), List.of("위협"));
        var draft = new ProfileAiDraft("소개", List.of(new ProfileAiDraft.Strength("강점", "근거")),
                "방식", "경험", "요약", swot);
        when(service.generate(42L, url, "자료", null)).thenReturn(draft);
        mvc.perform(post(BASE + "/ai-generate").contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(Map.of("baseUrl", url, "prompt", "자료"))))
                .andExpect(status().isOk()).andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(jsonPath("$.strengths[0].evidence").value("근거"))
                .andExpect(jsonPath("$.resumeSummary").value("요약"))
                .andExpect(jsonPath("$.swot.opportunities[0]").value("기회"))
                .andExpect(jsonPath("$.published").doesNotExist());
    }

    @Test
    void geminiPresetPayloadSavesWithActualControllerAndService() throws Exception {
        var store = mock(ProfileAiStore.class);
        var cipher = mock(ProfileAiKeyCipher.class);
        var provider = mock(ProfileAiProvider.class);
        var realMvc = settingsMvc(store, cipher, provider);
        String model = "gemini-3.1-flash-lite";
        String key = "AIza-synthetic-test-key_123456";
        when(cipher.encrypt(42L, GEMINI, key)).thenReturn("encrypted-key");
        realMvc.perform(put(BASE + "/ai-settings").contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(Map.of("baseUrl", GEMINI, "model", model,
                                "apiKey", key))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.baseUrl").value(GEMINI))
                .andExpect(jsonPath("$.model").value(model)).andExpect(jsonPath("$.hasApiKey").value(true))
                .andExpect(jsonPath("$.apiKey").doesNotExist());
        verify(store).save(42L, new Settings(GEMINI, model, "encrypted-key"));
        verifyNoInteractions(provider);
    }

    @ParameterizedTest(name = "{index} {1}")
    @MethodSource("invalidSettings")
    void classifiesSaveErrorsWithoutReturningFieldValues(String body, String errorCode) throws Exception {
        var store = mock(ProfileAiStore.class);
        var cipher = mock(ProfileAiKeyCipher.class);
        var provider = mock(ProfileAiProvider.class);
        settingsMvc(store, cipher, provider).perform(put(BASE + "/ai-settings").contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value(errorCode))
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(content().string(not(containsString("sensitive-marker"))));
        verifyNoInteractions(cipher, provider);
        verify(store, never()).save(anyLong(), any());
    }

    private static Stream<Arguments> invalidSettings() {
        String validUrl = "\"baseUrl\":\"" + GEMINI + "\"";
        String validModel = "\"model\":\"gemini-3.1-flash-lite\"";
        return Stream.of(
                Arguments.of("{\"baseUrl\":\"sensitive-marker\",", "PROFILE_AI_SETTINGS_BODY_INVALID"),
                Arguments.of(" ".repeat(20_001), "PROFILE_AI_SETTINGS_BODY_INVALID"),
                Arguments.of("{" + validModel + "}", "PROFILE_AI_SETTINGS_BODY_INVALID"),
                Arguments.of("{\"baseUrl\":1," + validModel + "}", "PROFILE_AI_SETTINGS_BODY_INVALID"),
                Arguments.of("{\"baseUrl\":\"https://sensitive-marker.example\"," + validModel + "}",
                        "PROFILE_AI_SETTINGS_URL_INVALID"),
                Arguments.of("{\"baseUrl\":\"[sensitive-marker\"," + validModel + "}",
                        "PROFILE_AI_SETTINGS_URL_INVALID"),
                Arguments.of("{" + validUrl + "}", "PROFILE_AI_SETTINGS_MODEL_INVALID"),
                Arguments.of("{" + validUrl + ",\"model\":false}", "PROFILE_AI_SETTINGS_MODEL_INVALID"),
                Arguments.of("{" + validUrl + ",\"model\":\"   \"}", "PROFILE_AI_SETTINGS_MODEL_INVALID"),
                Arguments.of("{" + validUrl + ",\"model\":\"" + "x".repeat(201) + "\"}",
                        "PROFILE_AI_SETTINGS_MODEL_INVALID"),
                Arguments.of("{" + validUrl + ",\"model\":\"sensitive-marker\\u000A\"}",
                        "PROFILE_AI_SETTINGS_MODEL_INVALID"),
                Arguments.of("{" + validUrl + "," + validModel + "}", "PROFILE_AI_SETTINGS_KEY_REQUIRED"),
                Arguments.of("{" + validUrl + "," + validModel + ",\"apiKey\":null}",
                        "PROFILE_AI_SETTINGS_KEY_INVALID"),
                Arguments.of("{" + validUrl + "," + validModel + ",\"apiKey\":123}",
                        "PROFILE_AI_SETTINGS_KEY_INVALID"),
                Arguments.of("{" + validUrl + "," + validModel + ",\"apiKey\":\"\"}",
                        "PROFILE_AI_SETTINGS_KEY_INVALID"),
                Arguments.of("{" + validUrl + "," + validModel + ",\"apiKey\":\"sensitive-marker space\"}",
                        "PROFILE_AI_SETTINGS_KEY_INVALID"),
                Arguments.of("{" + validUrl + "," + validModel + ",\"apiKey\":\"" + "x".repeat(2049) + "\"}",
                        "PROFILE_AI_SETTINGS_KEY_INVALID"));
    }

    private static MockMvc settingsMvc(ProfileAiStore store, ProfileAiKeyCipher cipher, ProfileAiProvider provider) {
        var service = new ProfileAiService(store, cipher, provider, new ProfileAiProviderUrl(""));
        return MockMvcBuilders.standaloneSetup(new ProfileAiApi(service, new ObjectMapper()))
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void malformedAndOversizedTestAndGenerateInputsRetainExistingErrorCode() throws Exception {
        mvc.perform(post(BASE + "/ai-generate").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"prompt\":\"" + "x".repeat(620_000) + "\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
        mvc.perform(post(BASE + "/ai-generate").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"prompt\":\"missing baseUrl\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
        mvc.perform(post(BASE + "/ai-settings/test").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
        verifyNoInteractions(service);
    }
}
