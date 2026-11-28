package forjun.web.module.profilesummary.infrastructure;

import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import forjun.web.module.profilesummary.application.port.out.ProfileAiKeyCipher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class AesProfileAiKeyCipher implements ProfileAiKeyCipher {
    private static final int NONCE_BYTES = 12;
    private static final int TAG_BITS = 128;
    private final SecureRandom random = new SecureRandom();
    private final SecretKeySpec key;

    public AesProfileAiKeyCipher(@Value("${PROFILE_AI_ENCRYPTION_KEY:}") String encodedKey) {
        SecretKeySpec configuredKey = null;
        if (!encodedKey.isBlank()) {
            try {
                byte[] decoded = Base64.getDecoder().decode(encodedKey);
                if (decoded.length == 32) {
                    configuredKey = new SecretKeySpec(decoded, "AES");
                }
            } catch (IllegalArgumentException ignored) {
                // Legacy features remain available when the AI encryption key is misconfigured.
            }
        }
        this.key = configuredKey;
    }

    @Override
    public String encrypt(long userId, String baseUrl, String plaintext) {
        byte[] nonce = new byte[NONCE_BYTES];
        random.nextBytes(nonce);
        try {
            byte[] encrypted = cipher(Cipher.ENCRYPT_MODE, nonce, userId, baseUrl)
                    .doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(ByteBuffer.allocate(nonce.length + encrypted.length)
                    .put(nonce).put(encrypted).array());
        } catch (GeneralSecurityException ex) {
            throw unavailable();
        }
    }

    @Override
    public String decrypt(long userId, String baseUrl, String encryptedKey) {
        try {
            byte[] encoded = Base64.getDecoder().decode(encryptedKey);
            if (encoded.length <= NONCE_BYTES + TAG_BITS / 8) {
                throw unavailable();
            }
            ByteBuffer buffer = ByteBuffer.wrap(encoded);
            byte[] nonce = new byte[NONCE_BYTES];
            buffer.get(nonce);
            byte[] encrypted = new byte[buffer.remaining()];
            buffer.get(encrypted);
            return new String(cipher(Cipher.DECRYPT_MODE, nonce, userId, baseUrl).doFinal(encrypted),
                    StandardCharsets.UTF_8);
        } catch (GeneralSecurityException | IllegalArgumentException ex) {
            throw unavailable();
        }
    }

    private Cipher cipher(int mode, byte[] nonce, long userId, String baseUrl) throws GeneralSecurityException {
        if (key == null) {
            throw unavailable();
        }
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(mode, key, new GCMParameterSpec(TAG_BITS, nonce));
        cipher.updateAAD((userId + "\0" + baseUrl).getBytes(StandardCharsets.UTF_8));
        return cipher;
    }

    private static AppException unavailable() {
        return AppException.of(ErrorCode.SERVER_ERROR, "profile AI encryption unavailable");
    }
}
