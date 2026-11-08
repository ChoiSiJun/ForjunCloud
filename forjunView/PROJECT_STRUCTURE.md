# 프로젝트 구조와 실행 안내

이 저장소는 Yarn 4.1.1 Workspaces로 관리하는 React + TypeScript 모노레포입니다.
실제 서비스는 `package/home`, 공통 라이브러리 공간은 `package/core`, UI 확인 도구는 `storybook`입니다.

## 디렉터리

```text
package.json                  워크스페이스, 공통 개발 도구, 루트 명령
yarn.lock                     전체 워크스페이스의 의존성 잠금 파일
.yarnrc.yml                   Yarn 실행 파일과 node_modules 설치 방식
.eslintrc.cjs                  모든 워크스페이스의 공통 ESLint 설정
.prettierrc                    코드 형식 설정
tsconfig.base.json            공통 TypeScript 컴파일 옵션
default.conf                  운영 Nginx 정적 파일 및 API 프록시 설정
package/
  home/                       실제 서비스 앱 (@package/home)
    src/pages/                페이지
    src/domain/               도메인별 API, 타입, 훅, 폼
    src/common/               서비스 내부 공통 코드와 UI
    src/config/               Axios 등 설정
    src/store/                Redux 상태
    src/ui-kit/               앱 레이아웃과 테마
    .env.dev                  개발 API 주소
    .env.prod                 운영 API 주소
  core/                       공통 라이브러리 (@package/core)
    src/index.ts              라이브러리 공개 진입점, 현재는 빈 export
storybook/
  .storybook/main.ts          서비스의 stories 탐색 및 Vite 별칭 설정
  .storybook/preview.tsx      테마와 Redux Provider
  src/                        기존 Vite 예제 앱
```

`core`는 아직 공통 구현이 없는 준비 단계입니다. 현재 서비스의 공통 UI는 `home/src/common`에 있습니다.
둘 이상 앱에서 실제로 공유할 코드가 생기면 `core`로 옮기고 `src/index.ts`에서 export합니다.
`core`는 별도 웹 서버가 아니라 소스를 소비하는 라이브러리이므로 `dev`/`preview` 명령이 없습니다.
소비하는 Vite 앱이 TypeScript 소스를 번들링합니다. 외부 npm 배포용 빌드는 구성하지 않았습니다.

## 설치와 명령

저장소 루트에서 실행합니다. 패키지 관리자는 Yarn만 사용하며 `npm install`은 사용하지 않습니다.
`packageManager`와 저장소에 포함된 Yarn 실행 파일 모두 4.1.1입니다.

```sh
yarn install --immutable
yarn dev
```

Corepack/Yarn 실행 명령이 준비되지 않은 환경에서는 저장소에 포함된 실행 파일을 사용할 수 있습니다.

```sh
node .yarn/releases/yarn-4.1.1.cjs install --immutable
node .yarn/releases/yarn-4.1.1.cjs dev
```

| 루트 명령 | 역할 |
| --- | --- |
| `yarn dev` / `yarn home dev` | 서비스 개발 서버, 기본 포트 3001 |
| `yarn build` / `yarn home build` | 서비스 TypeScript 검사 및 운영 빌드 |
| `yarn home preview` | 생성된 서비스 빌드의 로컬 미리보기 |
| `yarn typecheck` | 모든 워크스페이스의 TypeScript 검사 |
| `yarn lint` | 모든 워크스페이스의 src 코드 검사, 경고도 실패 처리 |
| `yarn home lint` | 서비스 코드만 검사 |
| `yarn core typecheck` | 공통 라이브러리 타입 검사 |
| `yarn storybook` | UI Storybook 실행, 포트 6006 |
| `yarn build-storybook` | Storybook 정적 빌드 |

`yarn home dev` → 루트의 `home` 스크립트 → `yarn workspace @package/home dev` → home의 `vite --mode dev` 순서로 실행됩니다.
서비스 빌드 결과는 `package/home/dist`, Storybook 결과는 `storybook/storybook-static`에 생성됩니다.
`yarn build`는 서비스만 빌드하며 Storybook은 별도로 빌드합니다.

## package.json과 의존성

- 루트: ESLint, Prettier, TypeScript, 공통 Vite 도구와 타입을 관리합니다.
- home: 서비스가 사용하는 React, MUI, Axios, 폼 및 상태 관리 라이브러리를 선언합니다.
- core: React를 peer dependency로 선언해 소비하는 앱의 React를 사용합니다.
- storybook: Storybook 도구와 preview에서 직접 사용하는 UI 의존성을 선언합니다.
- 내부 패키지는 `@package/core: workspace:*`로 연결합니다.

설치 파일이 루트 `node_modules`에 모일 수 있어도 의존성은 사용하는 워크스페이스에 선언해야 합니다.
예: `yarn workspace @package/home add 라이브러리명`.
공통 개발 도구 추가는 루트에서 `yarn add -D 도구명`을 실행합니다.
변경된 package.json과 yarn.lock은 함께 커밋합니다.

## ESLint와 Prettier

ESLint는 루트 `.eslintrc.cjs` 하나를 사용합니다. 현재 버전은 ESLint 8이며 기존 설정 방식으로 통일했습니다.
Airbnb, TypeScript, React Hooks 규칙을 적용하고, stories 파일에는 Storybook 규칙을 추가합니다.
TypeScript 프로젝트 경로는 설정 파일 위치에 고정되어 패키지별 실행 위치에 영향을 받지 않습니다.
검사 대상은 각 패키지의 `src`이며 빌드 결과 및 도구 설정 파일은 제외됩니다.

Prettier는 `.prettierrc`의 들여쓰기·따옴표 등 형식 규칙을 사용합니다.
`eslint-config-prettier`는 형식 규칙 충돌을 줄이는 설정이며 ESLint가 Prettier를 자동 실행하는 것은 아닙니다.
VS Code 설정은 `node_modules` 기반 도구와 패키지별 작업 디렉터리를 사용합니다.

개발 서버와 운영 빌드는 lint를 자동 실행하지 않습니다. 배포 전 `yarn lint`, `yarn typecheck`, `yarn build`를 각각 확인합니다.

## 개발과 운영

| 구분 | 설정 | API 주소 |
| --- | --- | --- |
| 개발 실행 | home/.env.dev | http://localhost:8085 |
| 운영 빌드 | home/.env.prod | /server |

Axios는 `VITE_REST_API`를 baseURL로 사용합니다. Vite 환경 변수는 빌드 시 결과물에 반영됩니다.
`default.conf`는 `/server/`를 `http://backend:8085/`로 전달하고 SPA 경로를 index.html로 처리합니다.
실제 배포에서 이 Nginx 설정을 사용해야 하며, `vite preview` 자체에는 이 프록시가 없습니다.

## 이번 정리와 검증 (2026-11-08)

- Yarn 버전을 통일하고 npm 잠금 파일을 제거했습니다.
- 서비스 의존성을 home으로 옮기고 필요한 직접 의존성과 peer 의존성을 보완했습니다.
- 내부 워크스페이스 참조를 명시하고 core의 진입점을 추가했습니다.
- ESLint 설정을 하나로 통일하고 기존 home lint의 CLI 옵션 충돌을 해결했습니다.
- 공통 TypeScript 설정의 앱 참조를 제거해 옵션 상속과 프로젝트 참조를 구분했습니다.
- Storybook 설정을 storybook/.storybook으로 통합했습니다. JSX preview 확장자와 Windows 경로 처리를 수정했습니다.

검증 결과:

- 전체 TypeScript 검사: 통과.
- Storybook 빌드: 통과. 번들 크기 및 외부 도구 경고는 남아 있습니다.
- 서비스 운영 빌드: 통과. 누락된 로고 import를 제거하고 logoUrl을 빈 문자열로 두었습니다. 이미지 URL이 없으면 이미지 태그를 렌더링하지 않습니다. 로고 추가 시 SideBarHeader.tsx의 logoUrl을 변경하세요.
- ESLint: 오류·경고 없이 통과. Switch 가이드 상수를 별도 파일로 분리하고, Storybook alert를 Actions로 교체했으며, children 전달 방식·불필요한 return·예제 링크와 버튼 속성을 수정했습니다.
- 설치 시 `@toast-ui/react-editor`의 React 17 peer 요구와 앱의 React 18 사이에 경고가 남습니다. 에디터 호환성은 별도 검증/교체가 필요하며 요구 버전을 강제로 덮어쓰지 않았습니다.

서비스와 Storybook 빌드의 큰 번들 경고 및 Toast UI의 React peer 버전 경고는 별도 개선 사항으로 남아 있습니다.
