import { defineEndpoint } from '@common/type/ApiEndPoint';
import { History } from '@domain/history/History';

const apiBase = '/history';
const publicApiBase = '/public-history';

export interface HistorySaveRequest extends Omit<History, 'id'> {}
export interface HistoryUpdateRequest extends History {}
export interface HistoryDeleteRequest extends Pick<History, 'id'> {}
export interface HistoryListRequest extends Pick<History, 'category'> {}
export interface HistoryListResponse extends History {}
export interface HistoryDetailRequest extends Pick<History, 'id'> {}
export interface HistoryDetailResponse extends History {}
export interface HistoryPublicListRequest extends Pick<History, 'userId' | 'category'> {}
export interface HistoryPublicListResponse extends Omit<History, 'userId'> {}

export const HISTORY_API_ENDPOINTS = {
  // 히스토리 저장
  save: defineEndpoint<HistorySaveRequest, void>({
    url: `/api/v1${  apiBase}`,
    method: 'POST',
  }),

  // 히스토리 수정
  update: defineEndpoint<HistoryUpdateRequest, void>({
    url: `/api/v1${  apiBase}`,
    method: 'PUT',
  }),

  // 히스토리 삭제
  delete: defineEndpoint<HistoryDeleteRequest, void>({
    url: `/api/v1${  apiBase}`,
    method: 'DELETE',
  }),

  // 히스토리 리스트 정보가져오기
  get: defineEndpoint<HistoryListRequest, HistoryListResponse>({
    url: `/api/v1${  apiBase  }/list`,
    method: 'GET',
  }),

  // 히스토리 상세 정보 가져오기
  getDetail: defineEndpoint<HistoryDetailRequest, HistoryDetailResponse>({
    url: `/api/v1${  apiBase}`,
    method: 'GET',
  }),

  // 공개 히스토리 리스트 가져오기
  getPublicList: defineEndpoint<HistoryPublicListRequest, HistoryPublicListResponse>({
    url: `/api/v1${  publicApiBase  }/list`,
    method: 'GET',
  }),
};
