package forjun.web.module.user.application.port.in.dto;

import forjun.web.module.user.domain.PrivateStatus;

public record ChangeUserPrivacyCommand(long id, PrivateStatus historyPrivate, PrivateStatus personalPrivate) {}
