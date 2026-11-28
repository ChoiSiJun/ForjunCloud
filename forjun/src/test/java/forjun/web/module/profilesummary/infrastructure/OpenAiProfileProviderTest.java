package forjun.web.module.profilesummary.infrastructure;

import com.fasterxml.jackson.databind.ObjectMapper;
import forjun.web.exception.AppException;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OpenAiProfileProviderTest {
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient client = mock(HttpClient.class);
    @SuppressWarnings("unchecked")
    private final HttpResponse<byte[]> response = mock(HttpResponse.class);
    private final OpenAiProfileProvider provider = new OpenAiProfileProvider(mapper, client);
    private final URI endpoint = URI.create("https://api.openai.com/v1/chat/completions");

    @Test
    void mapsValidProviderResponseToPrivateDraft() throws Exception {
        String draft = """
                {"headline":"소개","strengths":[{"title":"강점","evidence":"근거"}],
                 "workingStyle":"방식","representativeExperience":"경험","resumeSummary":"요약",
                 "swot":{"strengths":["강점"],"weaknesses":["미확인"],"opportunities":["기회"],"threats":["위협"]}}
                """;
        when(response.statusCode()).thenReturn(200);
        when(response.body()).thenReturn(mapper.writeValueAsBytes(Map.of("choices",
                List.of(Map.of("message", Map.of("content", draft), "finish_reason", "stop")))));
        when(client.<byte[]>sendAsync(any(), any())).thenReturn(CompletableFuture.completedFuture(response));
        var result = provider.generate(endpoint, "model", "test-key", "제출 자료", "개발자");
        assertThat(result.resumeSummary()).isEqualTo("요약");
        assertThat(result.swot().weaknesses()).containsExactly("미확인");

        ArgumentCaptor<HttpRequest> request = ArgumentCaptor.forClass(HttpRequest.class);
        verify(client).sendAsync(request.capture(), any());
        assertThat(request.getValue().uri()).isEqualTo(endpoint);
        assertThat(request.getValue().headers().firstValue("Authorization")).contains("Bearer test-key");
        assertThat(request.getValue().timeout()).contains(Duration.ofSeconds(45));

        when(response.body()).thenReturn(mapper.writeValueAsBytes(Map.of("choices",
                List.of(Map.of("message", Map.of("content", draft.replace("소개", "test-key")))))));
        assertThatThrownBy(() -> provider.generate(endpoint, "model", "test-key", "제출 자료", "개발자"))
                .isInstanceOf(AppException.class).hasMessageNotContaining("test-key");
    }

    @Test
    void connectionTestAcceptsValidCompletionShapeWithoutGeneratedText() throws Exception {
        when(response.statusCode()).thenReturn(200);
        when(response.body()).thenReturn(mapper.writeValueAsBytes(Map.of("choices",
                List.of(Map.of("message", Map.of("role", "assistant", "content", ""), "finish_reason", "length")))));
        when(client.<byte[]>sendAsync(any(), any())).thenReturn(CompletableFuture.completedFuture(response));
        provider.test(endpoint, "model", "test-key");
        assertThatThrownBy(() -> provider.generate(endpoint, "model", "test-key", "material", ""))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "PROFILE_AI_PROVIDER_FAILED");
    }

    @Test
    void providerErrorIsGenericAndMalformedOutputFails() {
        when(response.statusCode()).thenReturn(401);
        when(client.<byte[]>sendAsync(any(), any())).thenReturn(CompletableFuture.completedFuture(response));
        assertThatThrownBy(() -> provider.test(endpoint, "model", "test-key"))
                .isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", "PROFILE_AI_PROVIDER_FAILED")
                .hasMessageNotContaining("test-key");
        verify(response, never()).body();
        assertThatThrownBy(() -> provider.parseDraft("{\"headline\":\"only\"}"))
                .isInstanceOf(AppException.class).hasFieldOrPropertyWithValue("errorCode", "PROFILE_AI_PROVIDER_FAILED");
    }
}
