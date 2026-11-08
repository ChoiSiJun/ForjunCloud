# 백엔드 경계와 서버 분리 준비

## 기준 흐름

`api DTO → api Mapper → application Command/Query → Service → out Port → infrastructure Adapter → Repository`

조회는 domain 또는 application View를 API Mapper에서 응답 DTO로 변환한다.
application은 업무 순서·소유권·업무 예외를 처리하고 infrastructure는 DB·파일·외부 통신을 구현한다.
대표 구현은 history이며, 모듈 간 어댑터 예제는 PersonalImageAdapter다.

## 현재 코드의 예외

- ContentService는 ContentJpaAdapter를 직접 참조한다. 초기 구현의 예외이며 신규 코드의 기준이 아니다.
- Mapper는 MapStruct와 수동 구현이 혼재한다. 대상 모듈 방식을 유지하고 일괄 전환하지 않는다.
- `Usecase/UseCase`, `Adapater` 등 기존 이름을 요청 없이 바꾸지 않는다.
- 파일 업로드 포트에는 Spring MultipartFile 의존성이 있다. 현재 구조를 기록하되 무관한 작업에서 일괄 순수화하지 않는다.
- Rule.txt의 application 규칙은 API DTO와 application 자체 Command/Query를 구분하도록 보완했다.

## 모듈 경계

각 모듈은 자신의 데이터와 영속성 구현을 소유한다. 다른 모듈의 Entity/Repository를 계약으로 사용하지 않는다.
다른 기능이 필요하면 소비 모듈의 out Port를 두고 infrastructure Adapter에서 제공 모듈의 in Port를 호출한다.
현재 PersonalImagePort → PersonalImageAdapter → FileQuery가 이 패턴이다.
같은 서버에서는 로컬 호출을 유지할 수 있다. 모든 경계를 미리 HTTP로 바꿀 필요는 없다.

## 독립 서버로 이동할 때 확인할 사항

1. 분리 대상의 부하·지연·장애 범위와 데이터 소유권을 확인한다.
2. JPA 관계, 직접 SQL, 공유 테이블, 교차 모듈 트랜잭션을 조사한다. 포트가 있어도 자동으로 분리되지는 않는다.
3. 소비 모듈의 포트를 유지하며 HTTP/메시지 어댑터와 별도 API 계약을 추가한다.
4. 타임아웃, 재시도 가능 조건, 중복 처리, 인증, 오류 변환을 어댑터에서 정한다.
5. 여러 서버의 쓰기는 하나의 로컬 DB 트랜잭션으로 원자성을 보장할 수 없다. 보상·이벤트·일관성 정책을 작업별로 설계한다.
6. 계약 테스트, 부분 실패 테스트, 관측·부하 검증, 단계적 전환·복구 경로를 준비한다.

이 문서는 서버 분리를 준비하는 지침이다. 자동 import 검사나 실제 분산 처리를 추가한 것은 아니다.
