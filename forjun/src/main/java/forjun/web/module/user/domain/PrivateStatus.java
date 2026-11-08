package forjun.web.module.user.domain;

public enum PrivateStatus {
    PUBLIC("공개"),
    PRIVATE("비공개");
    private final String value;

    PrivateStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
