package forjun.web.module.profilesummary.infrastructure;

import forjun.web.module.profilesummary.application.port.out.ProfileAiStore;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcProfileAiStore implements ProfileAiStore {
    private final JdbcTemplate jdbc;

    @Override
    public Optional<Settings> find(long userId) {
        return jdbc.query("""
                SELECT base_url, model, encrypted_key FROM profile_ai_settings WHERE user_id = ?
                """, (row, index) -> new Settings(row.getString("base_url"), row.getString("model"),
                row.getString("encrypted_key")), userId).stream().findFirst();
    }

    @Override
    public void save(long userId, Settings settings) {
        jdbc.update("""
                INSERT INTO profile_ai_settings (user_id, base_url, model, encrypted_key)
                VALUES (?, ?, ?, ?)
                ON CONFLICT (user_id) DO UPDATE SET base_url = EXCLUDED.base_url,
                    model = EXCLUDED.model, encrypted_key = EXCLUDED.encrypted_key
                """, userId, settings.baseUrl(), settings.model(), settings.encryptedKey());
    }

    @Override
    public boolean updateModel(long userId, String baseUrl, String model) {
        return jdbc.update("""
                UPDATE profile_ai_settings SET model = ? WHERE user_id = ? AND base_url = ?
                """, model, userId, baseUrl) == 1;
    }

    @Override
    public void delete(long userId) {
        jdbc.update("DELETE FROM profile_ai_settings WHERE user_id = ?", userId);
    }
}
