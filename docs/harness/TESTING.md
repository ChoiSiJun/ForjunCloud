# 프런트 검증

저장소 루트 또는 다른 디렉터리에서 스크립트의 경로를 지정해 실행할 수 있다.
Node와 기존 Yarn 설치가 필요하다. 의존성은 필요 시 `node .yarn/releases/yarn-4.1.1.cjs install --immutable`로 설치한다.

```powershell
powershell -NoProfile -File scripts/verify.ps1
powershell -NoProfile -File scripts/verify.ps1 -Suite full
powershell -NoProfile -File scripts/verify.ps1 -Suite full -Storybook
```

- 기본 quick: 전체 lint → home/core/Storybook의 개별 타입 검사 → 프로필 시나리오.
- full: quick + 서비스 운영 빌드.
- Storybook: quick/full 뒤에 Storybook 정적 빌드를 추가한다.

각 명령의 종료 코드를 즉시 확인한다. Yarn foreach의 집계 결과에만 의존하지 않도록
타입 검사는 tsc를 프로젝트별로 직접 실행한다.
타입 검사 캐시는 OS 임시 폴더에 고유 디렉터리를 만들어 사용하고 결과에 경로를 표시한다.
기존 추적 tsbuildinfo와 Storybook node_modules 캐시를 덮어쓰지 않도록 한 것이다.
서비스 build 명령 자체는 기존 package.json을 그대로 실행하므로 자체 빌드 산출물을 만들 수 있다.
임시 캐시는 자동 삭제하지 않으며 저장소 밖에 둔다.

프로필 시나리오는 기존 CJS/VM 스텁 테스트다. React 실제 렌더링, HTTP, 브라우저를 검증하지 않는다.
화면 변경에는 관련 화면의 정상·실패·로딩 동작을 별도로 확인하고 결과를 보고한다.
서비스 빌드와 Storybook 빌드 성공만으로 기능 검증 완료를 주장하지 않는다.

수동 실행: `node scripts/test-personal-profile.cjs`, `node .yarn/releases/yarn-4.1.1.cjs lint`.
전체 환경 설명은 기존 PROJECT_STRUCTURE.md를 참고한다.
