package forjun.web.module.history.application;

import forjun.web.exception.AppException;
import forjun.web.module.history.application.port.in.dto.DeleteHistoryCommand;
import forjun.web.module.history.application.port.in.dto.GetHistoryQuery;
import forjun.web.module.history.application.port.in.dto.UpdateHistoryCommand;
import forjun.web.module.history.application.port.out.HistoryJpaPort;
import forjun.web.module.history.domain.History;
import forjun.web.module.history.infrastructure.jpa.entity.HistoryEntity;
import forjun.web.module.history.infrastructure.jpa.mapper.HistoryEntityMapper;
import forjun.web.module.user.application.port.in.UserQuery;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

class HistoryServiceTest {
    private final HistoryJpaPort port = mock(HistoryJpaPort.class);
    private final HistoryService service = new HistoryService(port, mock(UserQuery.class));

    @Test
    void ownerCanUpdateHistory() {
        givenOwner("owner");

        service.updateHistory(command());

        verify(port).updateHistory(argThat(history ->
                history.getId().equals(10)
                        && history.getUserId().equals("owner")
                        && history.getProject().equals("updated project")));
    }

    @Test
    void anotherUserCannotUpdateHistory() {
        givenOwner("another-user");

        AppException exception = assertThrows(AppException.class,
                () -> service.updateHistory(command()));

        assertThat(exception.getErrorCode()).isEqualTo("HISTORY_NOT_ACCESS");
        assertThat(exception.getHttpStatus()).isEqualTo(HttpStatus.FORBIDDEN);
        verify(port, never()).updateHistory(any());
    }

    @Test
    void missingHistoryReturnsNotFound() {
        when(port.getHistory(10)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class,
                () -> service.updateHistory(command()));

        assertThat(exception.getErrorCode()).isEqualTo("HISTORY_NOT_FOUND");
        assertThat(exception.getHttpStatus()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(port, never()).updateHistory(any());
    }

    @Test
    void missingOwnerCannotUpdateHistory() {
        givenOwner(null);

        AppException exception = assertThrows(AppException.class,
                () -> service.updateHistory(command()));

        assertThat(exception.getHttpStatus()).isEqualTo(HttpStatus.FORBIDDEN);
        verify(port, never()).updateHistory(any());
    }

    private void givenOwner(String userId) {
        HistoryEntity entity = HistoryEntity.builder().id(10).userId(userId).build();
        History history = new HistoryEntityMapper().toDomain(entity);
        when(port.getHistory(10)).thenReturn(Optional.of(history));
    }

    @Test
    void ownerCanReadHistory() {
        givenOwner("owner");

        History history = service.getHistory(new GetHistoryQuery("owner", 10));

        assertThat(history.getId()).isEqualTo(10);
        assertThat(history.getUserId()).isEqualTo("owner");
    }

    @Test
    void anotherUserCannotReadHistory() {
        givenOwner("another-user");

        assertFailure(HttpStatus.FORBIDDEN, "HISTORY_NOT_ACCESS",
                () -> service.getHistory(new GetHistoryQuery("owner", 10)));
    }

    @Test
    void missingHistoryCannotBeRead() {
        when(port.getHistory(10)).thenReturn(Optional.empty());

        assertFailure(HttpStatus.NOT_FOUND, "HISTORY_NOT_FOUND",
                () -> service.getHistory(new GetHistoryQuery("owner", 10)));
    }

    @Test
    void historyWithoutOwnerCannotBeRead() {
        givenOwner(null);

        assertFailure(HttpStatus.FORBIDDEN, "HISTORY_NOT_ACCESS",
                () -> service.getHistory(new GetHistoryQuery("owner", 10)));
    }

    @Test
    void ownerCanDeleteHistory() {
        givenOwner("owner");

        service.deleteHistory(new DeleteHistoryCommand("owner", 10));

        verify(port).deleteHistory(10);
    }

    @Test
    void anotherUserCannotDeleteHistory() {
        givenOwner("another-user");

        assertFailure(HttpStatus.FORBIDDEN, "HISTORY_NOT_ACCESS",
                () -> service.deleteHistory(new DeleteHistoryCommand("owner", 10)));
        verify(port, never()).deleteHistory(anyInt());
    }

    @Test
    void missingHistoryCannotBeDeleted() {
        when(port.getHistory(10)).thenReturn(Optional.empty());

        assertFailure(HttpStatus.NOT_FOUND, "HISTORY_NOT_FOUND",
                () -> service.deleteHistory(new DeleteHistoryCommand("owner", 10)));
        verify(port, never()).deleteHistory(anyInt());
    }

    @Test
    void historyWithoutOwnerCannotBeDeleted() {
        givenOwner(null);

        assertFailure(HttpStatus.FORBIDDEN, "HISTORY_NOT_ACCESS",
                () -> service.deleteHistory(new DeleteHistoryCommand("owner", 10)));
        verify(port, never()).deleteHistory(anyInt());
    }

    private void assertFailure(HttpStatus status, String code, Runnable action) {
        AppException exception = assertThrows(AppException.class, action::run);
        assertThat(exception.getHttpStatus()).isEqualTo(status);
        assertThat(exception.getErrorCode()).isEqualTo(code);
    }

    private UpdateHistoryCommand command() {
        return new UpdateHistoryCommand("owner", 10, "project", "updated project",
                "subject", "description", List.of("Java"),
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 2, 1));
    }
}
