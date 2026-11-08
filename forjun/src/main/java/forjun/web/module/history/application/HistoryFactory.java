package forjun.web.module.history.application;

import forjun.web.module.history.application.port.in.dto.CreateHistoryCommand;
import forjun.web.module.history.application.port.in.dto.UpdateHistoryCommand;
import forjun.web.module.history.domain.History;

/** 히스토리 팩토리 */
public class HistoryFactory {

    /** 히스토리 생성 */
    public static History createHistory(CreateHistoryCommand command) {
        if(command == null) {
            throw new IllegalArgumentException("command is null");
        }
        if(command.userId() == null || command.userId().isEmpty()) {
            throw new IllegalArgumentException("userId is null or empty");
        }
        if(command.category() == null || command.category().isEmpty()) {
            throw new IllegalArgumentException("category is null or empty");
        }
        if(command.project() == null || command.project().isEmpty()) {
            throw new IllegalArgumentException("project is null or empty");
        }

        if(command.historyStartDate() == null) {
            throw new IllegalArgumentException("historyStartDate is null");
        }
        if(command.historyEndDate() == null) {
            throw new IllegalArgumentException("historyEndDate is null");
        }
        return History.builder()
            .userId(command.userId())
            .category(command.category())
            .project(command.project())
            .subject(command.subject())
            .description(command.description())
            .historySkill(command.historySkill())
            .historyStartDate(command.historyStartDate())
            .historyEndDate(command.historyEndDate())
            .build();
    }

    /** 히스토리 수정 */
    public static History createHistory(UpdateHistoryCommand command) {
        if(command == null) {
            throw new IllegalArgumentException("command is null");
        }

        if(command.userId() == null || command.userId().isEmpty()) {
            throw new IllegalArgumentException("userId is null or empty");
        }

        if(command.id() == null) {
            throw new IllegalArgumentException("id is null");
        }
        if(command.category() == null || command.category().isEmpty()) {
            throw new IllegalArgumentException("category is null or empty");
        }
        if(command.project() == null || command.project().isEmpty()) {
            throw new IllegalArgumentException("project is null or empty");
        }
        if(command.historyStartDate() == null) {
            throw new IllegalArgumentException("historyStartDate is null");
        }
        if(command.historyEndDate() == null) {
            throw new IllegalArgumentException("historyEndDate is null");
        }
        return History.builder()
            .id(command.id())
                .userId(command.userId())
            .category(command.category())
            .project(command.project())
            .subject(command.subject())
            .description(command.description())
            .historySkill(command.historySkill())
            .historyStartDate(command.historyStartDate())
            .historyEndDate(command.historyEndDate())
            .build();
    }
}
