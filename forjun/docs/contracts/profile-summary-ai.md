# 프로필 요약 AI API v1.2

- 상태는 구현 기준 확정이다. 기존 프로필 요약 API의 요청, 응답 및 공개 절차는 그대로 사용한다.
- 모든 요청에는 기존 JWT 인증이 필요하다. 사용자 ID는 인증 주체에서 받으며 각 요청은 본인 설정에만 접근한다.
- 경로는 백엔드 기준이다. 프런트는 기존 API baseURL 및 프록시를 사용한다.

| 메서드 및 경로 | 요청 | 성공 |
| --- | --- | --- |
| `GET /api/v1/profile-summary/ai-settings` | 본문 없음 | 200, 설정 조회 |
| `PUT /api/v1/profile-summary/ai-settings` | `{"baseUrl":"https://api.openai.com/v1","model":"gpt-4o-mini","apiKey":"사용자 키"}` | 200, 저장한 설정 |
| `DELETE /api/v1/profile-summary/ai-settings` | 본문 없음 | 204, 설정 삭제 |
| `POST /api/v1/profile-summary/ai-settings/test` | 본문 없음 | 204, 연결 확인 |
| `POST /api/v1/profile-summary/ai-generate` | `{"baseUrl":"https://api.openai.com/v1","prompt":"프로필 참고 자료","targetRole":"지원 직무"}` | 200, 검토용 초안 |

설정 응답은 `{"baseUrl":"https://api.openai.com/v1","model":"gpt-4o-mini","hasApiKey":true}` 형식이다. 설정이 없으면 `{"baseUrl":"","model":"","hasApiKey":false}`을 반환한다. API 키 자체를 반환하지 않는다.

설정에는 `baseUrl`과 `model`이 필요하다. API 키 필드를 생략하면 정규화된 URL이 동일한 기존 설정의 키를 유지한다. 신규 설정 또는 URL 변경 시 키가 필요하며 빈 값과 null은 허용하지 않는다. 모델은 200자, URL은 512자, 키는 출력 가능한 공백 없는 ASCII 2048자까지 허용한다. 연결 시험과 생성에는 저장된 설정을 사용한다.

`baseUrl`은 사용자가 전송 전에 확인한 연결 주소다. 설정 조회가 반환한 정규화된 값을 필수로 보내며 512 UTF-16 단위까지 허용한다. 생성 시 현재 저장된 연결 주소와 비교한다. `prompt`는 공백이 아닌 필수 문자열이며 100,000 UTF-16 단위까지 허용한다. `targetRole`은 선택 문자열이며 200 UTF-16 단위까지 허용한다. 필드 생략, null, 공백은 목표 직무 미지정으로 처리한다. 추가 쿼리 및 사용자 지정 헤더는 사용하지 않는다. 200 응답에는 캐시 저장을 금지한다. 초안 응답 예시는 다음과 같다.

```json
{
  "headline": "근거가 드러나는 한 줄 소개",
  "strengths": [{"title": "강점", "evidence": "경력 자료에 나온 구체적인 근거"}],
  "workingStyle": "일하는 방식",
  "representativeExperience": "대표 경험",
  "resumeSummary": "이력서용 요약",
  "swot": {
    "strengths": ["강점"],
    "weaknesses": ["자료에서 확인되지 않음"],
    "opportunities": ["기회"],
    "threats": ["자료에서 확인되지 않음"]
  }
}
```

| HTTP | 오류 코드 | 조치 |
| --- | --- | --- |
| 400 | `PROFILE_AI_SETTINGS_BODY_INVALID` | 설정 저장 요청의 JSON, 크기 및 `baseUrl` 필드의 타입을 확인한다. |
| 400 | `PROFILE_AI_SETTINGS_URL_INVALID` | 연결 주소의 형식과 허용 여부를 확인한다. |
| 400 | `PROFILE_AI_SETTINGS_MODEL_INVALID` | 모델 이름이 비어 있거나 형식이나 길이 제한을 어겼는지 확인한다. |
| 400 | `PROFILE_AI_SETTINGS_KEY_REQUIRED` | 처음 저장하거나 주소를 바꿀 때 사용할 API 키를 입력한다. |
| 400 | `PROFILE_AI_SETTINGS_KEY_INVALID` | API 키가 비어 있거나 문자열 형식이나 길이 제한을 어겼는지 확인한다. |
| 400 | `VALIDATION_FAILED` | 생성 또는 연결 시험 요청을 확인한다. |
| 409 | `PROFILE_AI_SETTINGS_REQUIRED` | 연결 설정을 저장한다. |
| 409 | `PROFILE_AI_SETTINGS_CHANGED` | 연결 설정을 다시 조회하고 전송 주소를 확인한다. |
| 502 | `PROFILE_AI_PROVIDER_FAILED` | 연결 설정과 제공자 상태를 확인하고 다시 시도한다. |
| 500 | `SERVER_ERROR` | 운영 배포의 암호화 설정을 확인한다. |

설정 저장 오류는 JSON `code`, `message` 필드를 반환한다. 저장 시 필드 값은 진단 로그와 오류 본문에 포함하지 않는다.

미인증 요청은 기존 JWT 보안 정책에 따른다. 설정 저장과 삭제는 사용자당 한 행에 적용된다. 삭제는 반복해도 204다. 연결 확인과 생성 재시도는 별도의 제공자 요청을 발생시킨다. 서버는 생성 입력 및 응답을 보관하지 않는다. 프로필 저장과 공개는 기존 프로필 요약 API를 사용하는 별도 사용자 동작이다.

## 배포

1. PostgreSQL에 [설정 마이그레이션](../migrations/profile-ai-settings.sql)을 배포 전에 적용한다.
2. 비밀 관리 시스템에서 생성한 암호학적 난수 32바이트를 표준 Base64로 인코딩해 `PROFILE_AI_ENCRYPTION_KEY`에 보관한다. 모든 백엔드 인스턴스가 동일한 비밀값을 쓰도록 설정한다. 이 환경 변수가 없거나 형식이 틀리면 키 저장과 복호화가 실패한다. 암호화 키를 교체하면 기존 행에 저장된 연결 키를 다시 입력해야 한다.
3. 기본 허용 주소는 OpenAI의 `https://api.openai.com/v1`과 Google Gemini의 `https://generativelanguage.googleapis.com/v1beta/openai`다. 여기에는 별도 허용 목록 설정이 필요 없다. 사전에 검토한 외부 제공자는 `PROFILE_AI_ALLOWED_HOSTS`에 정확한 DNS 호스트명을 쉼표로 구분해 추가한다. 운영자가 Gemini 호스트를 명시적으로 추가한 경우에는 기존 사용자 지정 경로도 사용할 수 있다. 허용 목록은 IP 주소, 와일드카드 및 URL을 받지 않는다. 추가 호스트는 운영자가 제어할 수 있거나 신뢰할 수 있는 공용 HTTPS 엔드포인트로 한정한다. 네트워크 환경에서 사설 네트워크 및 메타데이터 주소로의 송신을 차단한다. [Google Gemini OpenAI 호환 API 안내](https://ai.google.dev/gemini-api/docs/openai)

제공자가 응답한 오류 본문은 사용자에게 반환하지 않는다. 연결 확인에는 테스트 메시지만 전송하며 생성 시에는 제출한 자료와 목표 직무를 전송한다. 제공자의 모델, Chat Completions 엔드포인트 및 토큰 한도 매개변수 호환성은 제공자마다 다를 수 있다. 제공자 시간 한도는 연결 확인 20초, 생성 45초이며 응답 본문 한도는 96,000바이트다.

## 검증

유효한 초안과 응답 오류, 허용 호스트 정책, 기존 키 유지, 인증 사용자 설정과 요청 파싱을 모의 테스트로 검증한다. 배포 마이그레이션 및 실제 제공자 연동은 별도의 검증 범위다.
