package forjun.web.module.user.application.port.in.dto;

public record ChangeUserProfileCommand(long id, String userName, String email) {}
