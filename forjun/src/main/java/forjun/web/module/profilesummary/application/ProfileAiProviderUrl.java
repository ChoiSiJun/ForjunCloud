package forjun.web.module.profilesummary.application;

import forjun.web.exception.AppException;
import forjun.web.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProfileAiProviderUrl {
    private static final String OPENAI_HOST = "api.openai.com";
    private static final Map<String, String> BUILT_IN_PATHS = Map.of(
            OPENAI_HOST, "/v1",
            "generativelanguage.googleapis.com", "/v1beta/openai");
    private static final String DOMAIN = "(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?";
    private final Set<String> allowedHosts;

    public ProfileAiProviderUrl(@Value("${PROFILE_AI_ALLOWED_HOSTS:}") String allowedHosts) {
        this.allowedHosts = Arrays.stream(allowedHosts.split(","))
                .map(host -> host.strip().toLowerCase(Locale.ROOT))
                .filter(host -> host.matches(DOMAIN))
                .collect(Collectors.toUnmodifiableSet());
    }

    public String normalize(String value) {
        return normalize(value, ErrorCode.VALIDATION_FAILED);
    }

    String normalizeForSettings(String value) {
        return normalize(value, ErrorCode.PROFILE_AI_SETTINGS_URL_INVALID);
    }

    private String normalize(String value, ErrorCode errorCode) {
        if (value == null || value.length() > 512) {
            throw AppException.of(errorCode, "profile AI provider URL");
        }
        URI uri;
        try {
            uri = URI.create(value.strip());
        } catch (IllegalArgumentException ex) {
            throw AppException.of(errorCode, "profile AI provider URL");
        }
        if (!"https".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null
                || uri.getRawUserInfo() != null || uri.getRawQuery() != null || uri.getRawFragment() != null) {
            throw AppException.of(errorCode, "profile AI provider URL");
        }
        String host = uri.getHost().toLowerCase(Locale.ROOT);
        String builtInPath = BUILT_IN_PATHS.get(host);
        if ((builtInPath == null && !allowedHosts.contains(host))
                || (!uri.getRawAuthority().equalsIgnoreCase(host)
                    && !uri.getRawAuthority().equalsIgnoreCase(host + ":443"))) {
            throw AppException.of(errorCode, "profile AI provider URL");
        }
        String path = uri.getRawPath();
        if (!path.matches("(?:/[a-zA-Z0-9._~-]+)*/?")
                || Arrays.stream(path.split("/")).anyMatch(segment -> segment.equals(".") || segment.equals(".."))) {
            throw AppException.of(errorCode, "profile AI provider URL");
        }
        if (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }
        if (host.equals(OPENAI_HOST) && path.isEmpty()) {
            path = builtInPath;
        }
        if (builtInPath != null && !builtInPath.equals(path)
                && (host.equals(OPENAI_HOST) || !allowedHosts.contains(host))) {
            throw AppException.of(errorCode, "profile AI provider URL");
        }
        return "https://" + host + path;
    }

    public URI endpoint(String baseUrl) {
        return URI.create(normalize(baseUrl) + "/chat/completions");
    }

}
