import { defineEndpoint } from '@common/type/ApiEndPoint';
import { Personal } from '@domain/personal/Personal';

const apiBase = '/personal';
const publicApiBase = '/public-personal';

export interface PersonalSaveRequest extends Personal {}
export interface PersonalDetailResponse extends Personal {}
export interface PersonalPublicDetailRequest extends Pick<Personal, 'userId'> {}
export interface PersonalPublicDetailResponse extends Omit<Personal, 'id' | 'userId'> {}

export const PERSONAL_API_ENDPOINTS = {
  // 자기 소개서 저장
  save: defineEndpoint<PersonalSaveRequest, void>({
    url: `/api/v1${  apiBase}`,
    method: 'POST',
  }),

  // 자기소개서 정보 가져오기
  get: defineEndpoint<number, PersonalDetailResponse>({
    url: `/api/v1${  apiBase}`,
    method: 'GET',
  }),

  // 공개 자기소개서 정보 가져오기
  getPublic: defineEndpoint<PersonalPublicDetailRequest, PersonalPublicDetailResponse>({
    url: `/api/v1${  publicApiBase}`,
    method: 'GET',
  }),
};
