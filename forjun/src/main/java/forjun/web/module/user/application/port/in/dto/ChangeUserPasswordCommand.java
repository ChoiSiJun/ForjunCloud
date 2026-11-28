package forjun.web.module.user.application.port.in.dto;

public record ChangeUserPasswordCommand(long id, String currentPassword, String newPassword) {
    @Override
    public String toString() {
        return "ChangeUserPasswordCommand[id=" + id + "]";
    }
}
