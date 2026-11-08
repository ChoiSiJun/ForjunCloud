package forjun.web.module.history.application.port.in.dto;

public record GetPublicHistorysQuery(
    String category,
    String userId
) {
    
}
