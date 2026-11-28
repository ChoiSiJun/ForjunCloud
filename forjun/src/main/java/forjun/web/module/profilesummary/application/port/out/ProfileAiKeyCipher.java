package forjun.web.module.profilesummary.application.port.out;

public interface ProfileAiKeyCipher {
    String encrypt(long userId, String baseUrl, String key);
    String decrypt(long userId, String baseUrl, String encryptedKey);
}
