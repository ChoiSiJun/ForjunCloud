package forjun.web.module.user.domain;

import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

public final class UserPasswordPolicy {
    public static final String FORMAT = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$";
    private static final int MAX_BCRYPT_BYTES = 72;
    private static final Pattern PATTERN = Pattern.compile(FORMAT);

    private UserPasswordPolicy() {
    }

    public static boolean acceptsNewPassword(String value) {
        return value != null && value.getBytes(StandardCharsets.UTF_8).length <= MAX_BCRYPT_BYTES
                && PATTERN.matcher(value).matches();
    }
}
