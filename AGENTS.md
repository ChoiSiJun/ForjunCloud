# 백엔드 작업 지침

## 구조와 스타일

- Java 17, Spring Boot, Gradle Wrapper를 사용한다. 수정 대상 모듈의 명명·들여쓰기·Mapper 방식을 따른다.
- `module/<기능>/{api,application,domain,infrastructure}`를 유지한다. 새 기능의 대표 예제는 `history`다.
- API는 요청 검증·인증 주체 추출·매핑·HTTP 응답을 담당한다. 업무 판단은 application에 둔다.
- API DTO → API Mapper → application의 Command/Query → Service → out Port → Adapter/Repository 흐름을 따른다.
- application은 자체 Command/Query/View와 도메인을 사용한다. API DTO나 JPA 엔티티를 계약으로 노출하지 않는다.
- domain은 순수 상태를 유지하고 업무 예외는 application의 `AppException`/`ErrorCode` 패턴을 따른다.
- 모듈 사이에서 Repository·JPA 엔티티를 직접 공유하지 않는다. 소비 모듈의 포트와 어댑터를 사용한다.
- 향후 서버 분리를 고려해 데이터 소유권과 모듈 간 계약을 유지한다. 요청 없이 HTTP화·공유 DB 변경·분산 트랜잭션을 도입하지 않는다.
- 기존 예외와 분리 준비 기준은 `docs/harness/ARCHITECTURE.md`에 있다. 기존 예외를 새 코드의 기준으로 확대하지 않는다.

## 대표 코드

- 서비스/권한: `src/main/java/forjun/web/module/history/application/HistoryService.java`
- 경계 어댑터: `src/main/java/forjun/web/module/personal/infrastructure/image/PersonalImageAdapter.java`
- 테스트: `src/test/java/forjun/web/module/history/application/HistoryServiceTest.java`

## 검증과 협업

- 기존 기능의 버그 수정·기능 개선에는 `.agents/skills/forjun-maintenance/SKILL.md`의 영향 분석·선택 검증 절차를 사용한다. 문서·포맷 수정에는 강제하지 않는다.

- `powershell -NoProfile -File scripts/verify.ps1`은 DB 없는 기존 단위 테스트를 실행한다.
- `powershell -NoProfile -File scripts/verify.ps1 -Suite full`은 contextLoads를 포함한 전체 테스트를 실행한다. 별도 테스트 DB 설정을 먼저 확인한다.
- 사용자가 테스트 DB를 준비했다. DB 검증 시 실제 테스트 연결·프로필·데이터 격리 설정을 확인하고 기본 설정을 테스트 전용으로 추정하지 않는다.
- 실행 환경·제약은 `docs/harness/TESTING.md`를 따른다. 운영 설정, 비밀값, 실제 업로드 파일은 작업 근거 없이 수정하지 않는다.
- 프런트 계약이 바뀌면 메인에 경로·메서드·JSON 필드·null·오류 코드·호환성 영향을 전달한다.
- 다른 담당의 파일을 수정하거나 서브에이전트를 재생성하지 않는다. 단독 체크아웃에서도 이 문서가 적용된다.
