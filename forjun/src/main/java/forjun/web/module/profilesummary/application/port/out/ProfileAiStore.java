package forjun.web.module.profilesummary.application.port.out;

import java.util.Optional;

public interface ProfileAiStore {
    record Settings(String baseUrl, String model, String encryptedKey) {}

    Optional<Settings> find(long userId);
    void save(long userId, Settings settings);
    boolean updateModel(long userId, String baseUrl, String model);
    void delete(long userId);
}
