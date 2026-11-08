# Atomic design structure

새로운 공통 UI는 아래 네 계층을 사용합니다.

- `atoms`: 더 작은 UI로 분해할 필요가 없는 기본 표현 요소
- `molecules`: 둘 이상의 atom을 조합한 입력·표시 단위
- `organisms`: 도메인과 무관하게 재사용 가능한 독립 UI 영역
- `templates`: 라우트, 레이아웃, 전역 상태처럼 페이지 골격을 구성하는 요소

`elements`, `modules`, `template` 디렉터리는 기존 import 호환을 위해 유지합니다. 수정하는
컴포넌트부터 새 계층으로 옮기고 기존 경로에서는 re-export하는 방식으로 점진 이관합니다.
도메인 데이터 조회나 저장 로직은 atomic UI에 넣지 않고 `domain`의 hook에서 담당합니다.
