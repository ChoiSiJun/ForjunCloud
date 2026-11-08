// 1. 엔드포인트 런타임 값의 기본 구조
export interface ApiEndpoint {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

// 2. 🌟 타입스크립트가 요청(TReq)과 응답(TRes) 타입을 기억할 수 있도록 확장한 타입
// 이 타입은 런타임 코드가 아닌, 컴파일 시점에만 사용됩니다.
export interface TypedEndpoint<TReq, TRes> extends ApiEndpoint {
  readonly __requestType?: TReq;
  readonly __responseType?: TRes;
}

// 3. 헬퍼 함수: 이 함수가 제네릭 TReq, TRes를 받아서 타입을 '기억'하게 합니다.
// 'define' 접두어를 붙여 설정 파일을 정의할 때 사용됨을 명확히 합니다.
export const defineEndpoint = <TReq, TRes>(
  endpoint: TypedEndpoint<TReq, TRes>,
): TypedEndpoint<TReq, TRes> => endpoint;
