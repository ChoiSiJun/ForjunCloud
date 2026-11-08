package forjun.web.module.user.domain;

public enum AuthorityStatus {
    USER("이용자"), // 이이용자
    ADMIN("관리자"); // 관리자

    private final String value;

    AuthorityStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}

