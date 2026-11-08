# 하네스 구성 보고서

작성일: 2026-11-08

## 결과

백엔드·프런트 역할 분리, API 계약 기반 협업, 저장소별 지침, 실행 가능한 검증 진입점을 구성했다.
기존 제품 코드·라이브러리·폴더 구조는 변경하지 않았다. 기존 사용자 변경도 유지했다.
기존 문서 Rule.txt의 두 문장을 실제 Command/Query 구조와 일치하도록 수정했다.

## 설계 이유

- 상시 읽는 AGENTS.md는 짧게 두고 상세 구조·테스트 설명은 필요할 때 읽도록 분리했다.
- 두 담당은 필요할 때만 실행한다. 작은 변경은 메인이 직접 수행해 위임 비용을 줄인다.
- 모델은 고정하지 않았다. 현재 사용자 설정을 상속하고 특정 모델의 접근성에 의존하지 않는다.
- 전체 대화 대신 작업서로 필요한 사실만 전달하고, API 계약을 공유해 양쪽의 중복 조사·추측을 줄인다.
- 백엔드 규칙은 포트·데이터 소유권을 보존한다. 서버 분리 준비와 실제 분산 시스템 전환을 구분한다.
- 검증은 기존 도구를 사용한다. 검사 실패 즉시 중단하고 단위 테스트와 DB 의존 전체 테스트를 분리했다.
- 프런트 타입 캐시는 임시 경로로 지정해 기존 추적 파일과 Storybook node_modules 쓰기 문제를 피한다.
- 상위 폴더가 Git 저장소가 아니므로 각 저장소에 독립 지침과 검증을 보관했다. 상위 협업 설정의 공유는 별도 관리가 필요하다.

## 파일별 역할

| 위치 | 역할 |
| --- | --- |
| `../AGENTS.md` | 메인의 요청 분류·위임·통합 및 토큰 운영 규칙 |
| `../.codex/config.toml` | 담당 서브에이전트 동시 실행 상한 2 |
| `../.codex/agents/backend.toml` | 백엔드 담당의 소유 범위·경계·보고 형식 |
| `../.codex/agents/frontend.toml` | 프런트 담당의 소유 범위·기존 패턴·보고 형식 |
| `../forjun/AGENTS.md` | 백엔드 구조·대표 예제·검증 지침 |
| `../forjunView/AGENTS.md` | 프런트 구조·스타일·검증 지침 |
| `README.md` | 전체 운영 방식, 적용 범위, 자동화의 한계 |
| `TASK_TEMPLATE.md` | 담당에게 전달할 최소 작업서와 반환 형식 |
| `API_CONTRACT_TEMPLATE.md` | API 협업 시 공유할 계약 양식 |
| `../forjun/docs/harness/ARCHITECTURE.md` | 헥사고날 경계, 기존 예외, 독립 서버 전환 기준 |
| `../forjun/docs/harness/TESTING.md` | 단위/전체 테스트 범위, DB·캐시 주의점 |
| `../forjun/scripts/verify.ps1` | 기본 단위 테스트 또는 전체 테스트 실행 |
| `../forjunView/docs/harness/TESTING.md` | quick/full/Storybook 검증 범위와 제한 |
| `../forjunView/scripts/verify.ps1` | lint, 개별 타입, 프로필 시나리오, 선택 빌드 |
| `../forjun/Rule.txt` | API DTO와 application Command/Query 구분 보완 |

## 실제 검증 결과

- 두 verify.ps1: PowerShell AST 파서 구문 오류 없음.
- 두 저장소 `git diff --check`: 종료 코드 0. 기존 프런트 사용자 파일의 LF/CRLF 경고만 표시됨.
- 백엔드 `powershell -NoProfile -File scripts/verify.ps1`: 종료 코드 0.
  HistoryServiceTest 12, PersonalImageTest 9, FileQueryServiceTest 1,
  LocalFileStorageAdapterTest 15: 총 37개, 실패·오류 0.
- 프런트 동일 명령: 종료 코드 0. 전체 lint, home/core/Storybook app·node 타입 검사,
  프로필 저장·교체·실패 복구·불확실 결과·중복 제출 시나리오 통과.
- 초기 Windows 샌드박스 프로세스 시작은 setup refresh 오류로 실패했다. 승인된 확장 실행에서 위 검증을 완료했다.
- TOML 파일은 공식 standalone schema의 필수 필드·내용을 대조했다.
  독립 TOML 파서 및 Codex 커스텀 역할 실제 로딩 테스트는 수행하지 않았다.

## 남아 있는 범위

전체 백엔드 contextLoads, 서비스/Storybook 빌드, 브라우저 검증은 이번 변경에서 실행하지 않았다.
아키텍처 import 검사, 실제 HTTP 계약 테스트, E2E, 전용 테스트 DB, CI는 후속 구현 대상이다.
커스텀 역할이 새 세션에서 인식되는지 확인해야 하며, 현재 세션의 도구에 역할 선택 기능이 없으면
메인이 역할 지침을 일반 서브에이전트에 명시적으로 전달할 수 있다.
실제 토큰 절감은 측정 전이므로 절감률을 주장하지 않는다.

## 다음 작업에서 사용

이 작업 폴더를 프로젝트 설정을 지원하는 Codex의 새 세션으로 연다.
요청을 받은 메인은 작은 작업은 직접 수행하고 필요한 경우 backend 또는 frontend에 작업서를 전달한다.
API 변경 시 계약을 먼저 고정하고 담당별 구현 후 검증한다.
최종 보고는 변경 이유·검증 결과·미실행 항목을 포함한다.
