package forjun.web.module.profilesummary.infrastructure;

import forjun.web.exception.AppException;
import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AesProfileAiKeyCipherTest {
    @Test
    void protectsKeyAndBindsCiphertextToUserAndProvider() {
        var cipher = new AesProfileAiKeyCipher(Base64.getEncoder().encodeToString(new byte[32]));
        String baseUrl = "https://api.openai.com/v1";
        String encrypted = cipher.encrypt(42L, baseUrl, "private-key");
        assertThat(encrypted).doesNotContain("private-key").isNotEqualTo(cipher.encrypt(42L, baseUrl, "private-key"));
        assertThat(cipher.decrypt(42L, baseUrl, encrypted)).isEqualTo("private-key");
        assertThatThrownBy(() -> cipher.decrypt(43L, baseUrl, encrypted)).isInstanceOf(AppException.class);
        assertThatThrownBy(() -> cipher.decrypt(42L, "https://other.example.com/v1", encrypted))
                .isInstanceOf(AppException.class);
    }
}
