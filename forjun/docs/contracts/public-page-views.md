# 공개 페이지 조회 집계 v1

상태는 검증 완료. 기존 공개 조회 API의 응답은 유지한다.

- `POST /api/v1/public-page-views`는 익명 및 Bearer 인증 요청을 받는다. 본문은 `{"eventId":"32자리 소문자 16진수","userId":"공개 페이지 소유자 ID","page":"PERSONAL"}` 형식이다. page는 `PERSONAL`, `SI`, `SM`, `RND`, `TOY` 중 하나다. 필드는 모두 필수이며 userId는 최대 255자다.
- 유효한 방문은 204를 반환한다. 로그인한 소유자, 이미 처리한 eventId 및 비어 있는 경력 페이지도 기록 없이 204를 반환한다. 입력 오류는 400, 공개 대상 없음과 비공개는 기존 공개 조회의 오류 응답을 따른다. 동일 eventId의 재시도는 원자적으로 중복 제거된다.
- `GET /api/v1/dashboard/page-views`는 Bearer 인증이 필요하다. 조회 대상은 인증 주체로 결정한다. 성공 시 200과 `[{"date":"2026-11-22","personalViews":3,"historyViews":5}]` 형식의 배열을 반환한다. 한국 시간 기준 오늘을 포함한 30일이 날짜 오름차순이며 기록이 없는 날은 0이다. 모든 경력 카테고리는 historyViews에 합산한다. 인증 실패는 기존 보호 API 정책을 따른다.
- 집계 테이블에는 이벤트 ID, 소유자 내부 ID, 날짜, 콘텐츠 구분만 저장한다. 서버를 시작하기 전에 대상 PostgreSQL에 `docs/migrations/public-page-view.sql`을 적용한다.
- 임시 PostgreSQL과 실제 HTTP 요청으로 외부 방문, 동시 중복 요청, 로그인한 소유자, 비공개·빈 콘텐츠, 무인증 및 계정별 집계 접근, 일별 0 채우기를 확인했다. Chrome에서 공개 페이지 방문이 대시보드 차트에 반영되는 흐름과 오류·재시도·빈 상태를 확인했다.
