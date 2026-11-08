package forjun.web.module.history.api.dto;

import jakarta.validation.constraints.NotBlank;

public record GetPublicHistoryListRequest(

    /** 카테고리 */
    @NotBlank(message = "카테고리는 필수 입력 값입니다.")
    String category,
    /** 이용자 아이디 */
    @NotBlank(message = "이용자 아이디는 필수 입력 값입니다.")
    String userId
) {

}