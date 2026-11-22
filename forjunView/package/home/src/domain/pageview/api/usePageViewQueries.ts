import { useQuery } from 'react-query';
import { GetRequestType, GetResponseType } from '@common/utill/type-utils';
import axios from '@config/axios/axios';
import { PAGE_VIEW_API } from './pageViewApi';

const { record, summary } = PAGE_VIEW_API;

export const recordPageView = (data: GetRequestType<typeof record>) =>
  axios({ method: record.method, url: record.url, data });

export const usePageViewSummaryQuery = (userId: string) =>
  useQuery(['dashboard-page-views', userId], async () => {
    const response = await axios<GetResponseType<typeof summary>>({ method: summary.method, url: summary.url });
    return response.data;
  }, { retry: false });
