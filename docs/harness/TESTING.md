# 백엔드 검증

저장소 루트에서 Java 17과 Gradle Wrapper를 사용한다.

```powershell
powershell -NoProfile -File scripts/verify.ps1
powershell -NoProfile -File scripts/verify.ps1 -Suite full
```

기본 `unit`은 HistoryServiceTest, PersonalImageTest, FileQueryServiceTest,
LocalFileStorageAdapterTest만 선택한다. 현재 존재하는 DB 없는 테스트의 고정 목록이다.
테스트를 추가하면 목록을 함께 갱신하거나 향후 태그/별도 Gradle task로 분류한다.
테스트 대상이 없으면 Gradle 실패를 그대로 반환한다. full은 모든 테스트를 실행한다.

Full에는 `@SpringBootTest contextLoads`가 포함된다. 사용자가 테스트 DB를 준비했다.
테스트 DB의 준비와 실제 테스트 프로필/접속 설정의 연결은 구분한다. 실행 전 현재 연결 대상,
활성 프로필, 스키마 변경 설정, 테스트 데이터 격리·정리 방식을 확인한다.
기본 설정이 다른 PostgreSQL에 연결하거나 스키마를 변경할 수 있으므로 테스트 전용으로 추정하지 않는다.
스크립트는 DB를 생성·초기화하지 않는다. HTTP/E2E 요청 데이터는 테스트 메서드 롤백만으로 정리된다고 가정하지 않는다.

Gradle 캐시는 `-GradleUserHome <쓰기 가능한 캐시 경로>`로 지정할 수 있다.
기존 캐시가 없는 새 경로에서는 배포본·의존성 다운로드를 위한 네트워크가 필요하다.
스크립트는 캐시를 삭제하거나 시스템 환경 변수를 영구 변경하지 않는다.

실패 시 종료 코드와 첫 원인을 보고한다. 잠금 파일 생성 실패, 다운로드 실패, DB 연결 실패는
환경 실패이며 테스트 통과의 근거가 아니다. 이전 실행 보고서를 이번 실행 결과로 재사용하지 않는다.
계약·권한 변경에는 해당 HTTP 상태/JSON도 검증한다. 현재 스크립트에 HTTP/E2E 검사는 없다.
