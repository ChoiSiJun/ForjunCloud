package forjun.web.module.profilesummary.infrastructure;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import forjun.web.module.profilesummary.application.port.out.ProfileSummaryStore;
import forjun.web.module.profilesummary.domain.ProfileSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class JdbcProfileSummaryStore implements ProfileSummaryStore {
    private final JdbcTemplate jdbc;
    private final ObjectMapper mapper;

    @Override
    public Optional<ProfileSummary> find(String userId) {
        return read("SELECT content FROM profile_summary WHERE user_id = ?", userId);
    }

    @Override
    public Optional<ProfileSummary> findPublished(String userId) {
        return read("SELECT content FROM profile_summary WHERE user_id = ? AND published", userId);
    }

    private Optional<ProfileSummary> read(String sql, String userId) {
        return jdbc.query(sql, (row, index) -> {
            try {
                return mapper.readValue(row.getString("content"), ProfileSummary.class);
            } catch (JsonProcessingException e) {
                throw new IllegalStateException("Cannot read stored profile summary", e);
            }
        }, userId).stream().findFirst();
    }

    @Override
    public void save(String userId, ProfileSummary summary) {
        try {
            jdbc.update("""
                    INSERT INTO profile_summary (user_id, published, content)
                    VALUES (?, ?, CAST(? AS jsonb))
                    ON CONFLICT (user_id) DO UPDATE
                    SET published = EXCLUDED.published, content = EXCLUDED.content
                    """, userId, summary.published(), mapper.writeValueAsString(summary));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Cannot encode profile summary", e);
        }
    }
}
