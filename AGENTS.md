# 프런트 작업 지침

- Yarn 4.1.1만 사용한다. 필요하면 `node .yarn/releases/yarn-4.1.1.cjs <명령>`을 사용한다.
- 실제 앱은 `package/home`, `package/core`는 빈 공유 라이브러리 공간, Storybook은 UI 확인 도구다.
- `pages → domain의 업무 hook → query/mutation hook → endpoint + 공통 Axios` 흐름을 따른다.
- 서버 상태는 기존 React Query, 앱 상태는 Redux, 폼은 수정 대상의 기존 Formik/Yup 등 패턴을 유지한다.
- 공통 UI에 도메인 API 호출을 넣지 않는다. 앱 내부 공통 코드를 요청 없이 core로 이동하지 않는다.
- 기존 `elements/modules/template` 경로와 새 Atomic 계층이 공존한다. 기존 컴포넌트 수정만으로 이동을 강제하지 않는다. 명시적인 이관 작업에서는 호환 re-export를 유지한다.
- 루트 ESLint·Prettier와 파일 주변 스타일을 따른다. 기존 이름의 오타·export·별칭을 무관하게 정리하지 않는다.
- API 타입은 `defineEndpoint`와 `GetRequestType/GetResponseType` 패턴을 따른다. Java와의 일치는 별도 계약으로 확인한다.
- 대표 예제: `package/home/src/domain/history/hooks/useHistory.ts`, `domain/history/api/useInsertHistoryMutation.ts`.
- 프로필 이미지 변경 시 `scripts/test-personal-profile.cjs`와 백엔드의 `docs/personal-images.md` 계약을 확인한다.
- `powershell -NoProfile -File scripts/verify.ps1`로 lint·각 워크스페이스 타입·프로필 시나리오를 검증한다.
- 서비스 빌드는 `-Suite full`, Storybook까지는 `-Suite full -Storybook`을 사용한다. 상세 범위는 `docs/harness/TESTING.md`에 있다.
- UI 동작을 변경하면 관련 화면의 성공·실패·로딩 상태를 확인한다. 빌드 성공을 브라우저 검증으로 간주하지 않는다.
- 백엔드 계약이 필요하면 메인에 요청한다. 담당 범위 밖 파일을 임의 수정하거나 재위임하지 않는다.
