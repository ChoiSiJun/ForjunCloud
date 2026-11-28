import { defineEndpoint } from '@common/type/ApiEndPoint';
import { User } from '@domain/user/user';

// API Base
const userApiBase = '/user';

// API request type
export interface DuplicateIdCheckUserRequest extends Pick<User, 'userId'> {}
export interface JoinUserRequest extends Pick<User, 'userId' | 'password' | 'userName' | 'email'> {}
export interface LoginUserRequest extends Pick<User, 'userId' | 'password'> {}
export interface UserDetailResponse extends Pick<User, 'userName' | 'email' | 'historyPrivate' | 'personalPrivate'> {}
export type Visibility = 'PUBLIC' | 'PRIVATE';

// API endpoints
export const USER_API_ENDPOINTS = {
  // ID 중복 체크
  duplicateCheckId: defineEndpoint<DuplicateIdCheckUserRequest, void>({
    url: `/api/v1${  userApiBase  }/duplicate`,
    method: 'GET',
  }),

  // 회원가입
  join: defineEndpoint<JoinUserRequest, void>({
    url: `/api/v1${  userApiBase}`,
    method: 'POST',
  }),

  // 로그인
  login: defineEndpoint<LoginUserRequest, string>({
    url: `/api/v1${  userApiBase  }/login`,
    method: 'POST',
  }),

  // 사용자 정보 조회
  get: defineEndpoint<void, UserDetailResponse>({
    url: `/api/v1${  userApiBase}`,
    method: 'GET',
  }),

  updateProfile: defineEndpoint<Pick<User, 'userName' | 'email'>, void>({
    url: `/api/v1${userApiBase}/profile`,
    method: 'PATCH',
  }),

  updatePrivacy: defineEndpoint<{ historyPrivate: Visibility; personalPrivate: Visibility }, void>({
    url: `/api/v1${userApiBase}/privacy`,
    method: 'PATCH',
  }),

  updatePassword: defineEndpoint<{ currentPassword: string; newPassword: string }, void>({
    url: `/api/v1${userApiBase}/password`,
    method: 'PUT',
  }),
};
