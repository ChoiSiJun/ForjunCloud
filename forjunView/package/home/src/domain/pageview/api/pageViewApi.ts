import { defineEndpoint } from '@common/type/ApiEndPoint';

export type PublicPage = 'PERSONAL' | 'SI' | 'SM' | 'RND' | 'TOY';

export interface RecordPageViewRequest {
  eventId: string;
  userId: string;
  page: PublicPage;
}

export interface DailyPageViews {
  date: string;
  personalViews: number;
  historyViews: number;
}

export const PAGE_VIEW_API = {
  record: defineEndpoint<RecordPageViewRequest, void>({
    method: 'POST',
    url: '/api/v1/public-page-views',
  }),
  summary: defineEndpoint<void, DailyPageViews[]>({
    method: 'GET',
    url: '/api/v1/dashboard/page-views',
  }),
};
