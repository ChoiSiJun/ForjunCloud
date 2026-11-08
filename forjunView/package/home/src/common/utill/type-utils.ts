import { TypedEndpoint } from '@common/type/ApiEndPoint';

// 🌟 요청(Request) 타입만 추출하는 유틸리티 타입
export type GetRequestType<T> =
  T extends TypedEndpoint<infer TReq, unknown> ? TReq : never;

// 🌟 응답(Response) 타입만 추출하는 유틸리티 타입
export type GetResponseType<T> =
  T extends TypedEndpoint<unknown, infer TRes> ? TRes : never;
