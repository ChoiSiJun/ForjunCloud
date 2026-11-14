# ForTunCloud

개인 프로필과 프로젝트 이력을 관리·공개하는 서비스입니다.
백엔드, 프런트, AI 개발 하네스를 상위 Git 저장소 하나에서 관리하는 구성을 목표로 합니다.
각 프로젝트의 디렉터리와 빌드·실행 방식은 유지합니다.

## 구성

```text
ForTunCloud/
├── forjun/           Java 17 / Spring Boot 3.5.7 백엔드
├── forjunView/       React 18 / TypeScript / Vite / Yarn Workspaces
├── AGENTS.md         공통 작업 규칙과 작업별 지침 선택
├── .codex/           에이전트 설정
└── harness/          하네스 운영 문서와 협업 템플릿
```

백엔드는 도메인별 헥사고날 구조를 사용하며, 향후 모듈별 서버 분리를 고려해 포트와 데이터 소유권을 유지합니다.
프런트의 실제 앱은 `forjunView/package/home`, 공유 라이브러리 공간은 `package/core`, UI 확인 도구는 Storybook입니다.
단일 저장소여도 서버 실행·빌드·배포는 각각 수행합니다.

## 개발 환경

- JDK 17, PostgreSQL
- Node.js 20 계열 개발 환경, 저장소에 포함된 Yarn 4.1.1
- Windows PowerShell: 제공된 검증 스크립트 실행

Gradle은 `forjun/gradlew.bat`, Yarn은 `forjunView/.yarn/releases/yarn-4.1.1.cjs`를 사용합니다.
프런트 의존성 설치에는 Yarn만 사용합니다.

## 로컬 설정과 실행

아래 명령은 각각 **상위 저장소 루트**에서 시작합니다. 서버는 별도 터미널에서 실행합니다.
기존 로컬 설정이 있으면 복사 명령으로 덮어쓰지 말고 현재 값을 유지하세요.

### 백엔드

```powershell
Copy-Item forjun/src/main/resources/application.example.yml forjun/src/main/resources/application.yml
```

복사한 설정은 환경 변수 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET_KEY`를 사용합니다.
PostgreSQL DB와 스키마를 준비하고 해당 환경 변수를 서버 실행 터미널에 설정합니다.
JWT 키는 HS256에 사용할 충분한 길이의 임의 비밀값(UTF-8 기준 최소 32바이트)을 사용합니다.
예제는 `ddl-auto: validate`이므로 테이블을 자동 생성하지 않습니다.
빈 로컬 개발 DB를 처음 준비할 때는 접속 대상이 개발 전용인지 확인하고, 실행 터미널에서
`$env:SPRING_JPA_HIBERNATE_DDL_AUTO = 'update'`를 한 번 지정한 뒤 `bootRun`을 실행합니다.
테이블이 생성되면 서버를 종료하고 `Remove-Item Env:SPRING_JPA_HIBERNATE_DDL_AUTO`로 임시 설정을 해제합니다.
기존 DB의 스키마 변경은 [프로필 이미지 문서](forjun/docs/personal-images.md)의 SQL을 확인한 뒤 적용합니다.

```powershell
Set-Location forjun
.\gradlew.bat bootRun
```

기본 주소는 `http://localhost:8085`입니다. 실제 접속 정보와 JWT 키는 커밋하지 않습니다.

### 프런트

```powershell
Copy-Item forjunView/package/home/.env.dev.example forjunView/package/home/.env.dev
Copy-Item forjunView/package/home/.env.prod.example forjunView/package/home/.env.prod
Set-Location forjunView
node .yarn/releases/yarn-4.1.1.cjs install --immutable
node .yarn/releases/yarn-4.1.1.cjs dev
```

기본 주소는 `http://localhost:3001`입니다. 개발 API 주소는 `.env.dev`의 `VITE_REST_API`로 지정합니다.
`VITE_` 값은 브라우저에 포함되므로 비밀값을 넣지 않습니다.

## 검증

아래 명령은 상위 저장소 루트에서 실행합니다.

| 범위 | 명령 |
| --- | --- |
| 백엔드 기존 DB 없는 단위 테스트 | `powershell -NoProfile -File forjun/scripts/verify.ps1` |
| 백엔드 전체 테스트 | `powershell -NoProfile -File forjun/scripts/verify.ps1 -Suite full` |
| 프런트 lint·타입·프로필 시나리오 | `powershell -NoProfile -File forjunView/scripts/verify.ps1` |
| 프런트 서비스 빌드 포함 | `powershell -NoProfile -File forjunView/scripts/verify.ps1 -Suite full` |
| Storybook 빌드까지 포함 | `powershell -NoProfile -File forjunView/scripts/verify.ps1 -Suite full -Storybook` |

테스트 DB는 준비되어 있으며 실행 전 실제 연결·프로필·데이터 정리 방식을 확인합니다.
전체 테스트는 기본 application 설정도 사용할 수 있으므로 개발/운영 DB와 혼동하지 않습니다.
스크립트 성공은 브라우저 E2E 성공과 다릅니다. 변경 영향에 따라 관련 테스트를 선택합니다.

- [백엔드 검증 안내](forjun/docs/harness/TESTING.md)
- [프런트 검증 안내](forjunView/docs/harness/TESTING.md)

## 빌드와 운영 설정

백엔드는 `forjun`에서 `.\gradlew.bat bootJar`, 프런트는 `forjunView`에서
`node .yarn/releases/yarn-4.1.1.cjs build`로 빌드합니다.
프런트 산출물은 `forjunView/package/home/dist`입니다.
운영 프런트 예제의 API 주소 `/server`는 `forjunView/default.conf`의 프록시 구성을 전제로 합니다.
이 설정은 `backend:8085`로 전달하므로 실제 배포의 호스트·네트워크와 일치시켜야 합니다.
운영 백엔드 프로필과 비밀값은 배포 환경에서 별도로 공급합니다.

## 하네스와 Git 작업

메인은 백엔드 개발을 기본 담당하고, 독립적인 프런트 작업이 필요할 때 위임합니다.
공통 지침은 [AGENTS.md](AGENTS.md), 상세 운영은 [하네스 안내](harness/README.md)를 참고하세요.
버그 수정·기능 개선 절차는 [유지보수 스킬](forjun/.agents/skills/forjun-maintenance/SKILL.md)에 있습니다.

브랜치·스테이징·커밋·push·merge 등 Git 변경 작업은 사용자가 수행합니다.
AI는 명시적인 요청이 없으면 읽기 전용 Git 조회와 코드 수정·검증만 수행합니다.

## 통합 저장소 전환 시 확인

상위 원격 연결과 하위 Git 이력 통합은 별개입니다.
이 문서를 작성할 때 `forjun/.git`, `forjunView/.git`이 남아 있었습니다.
중첩 저장소 상태로 추가하면 소스 전체가 일반 파일로 포함되지 않을 수 있습니다.
기존 이력과 미커밋 변경을 백업하고 이력 보존 방식을 정한 다음, 사용자가 통합을 완료해야 합니다.
`.gitignore`는 이력을 합치거나 하위 `.git`을 제거하지 않습니다.

루트 `.gitignore`는 빌드·의존성·캐시·업로드·로컬 설정을 제외합니다.
하위 `.gitignore`도 해당 경로에서 계속 적용됩니다. 설정 예제·잠금 파일·Wrapper·하네스는 버전 관리 대상입니다.
이미 추적 중인 파일은 ignore 추가만으로 추적이 해제되지 않으므로 커밋 전에 변경 목록을 확인합니다.

## 상세 문서

- [프런트 구조와 명령](forjunView/PROJECT_STRUCTURE.md) — 문서의 루트는 `forjunView` 기준
- [백엔드 아키텍처](forjun/docs/harness/ARCHITECTURE.md)
- [API 계약 템플릿](harness/API_CONTRACT_TEMPLATE.md)
