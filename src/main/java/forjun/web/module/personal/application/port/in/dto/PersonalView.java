package forjun.web.module.personal.application.port.in.dto;

import forjun.web.module.personal.domain.Personal;

/** 저장 모델과 조회용 이미지 URL을 분리한다. */
public record PersonalView(Personal personal, String profileImageUrl) {}
