import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from '@config/axios/axios';
import { GetRequestType, GetResponseType } from '@common/utill/type-utils';
import { PROFILE_SUMMARY_API } from './profileSummaryApi';

const { own, save, published } = PROFILE_SUMMARY_API;

async function fetchSummary(endpoint: typeof own | typeof published, url: string) {
  const { data, status } = await axios<GetResponseType<typeof own>>({ url, method: endpoint.method });
  return status === 204 ? null : data;
}

export const useOwnSummaryQuery = (userId: string) =>
  useQuery(['profile-summary', userId], () => fetchSummary(own, own.url), { retry: false });

export const usePublishedSummaryQuery = (userId: string) =>
  useQuery(['public-profile-summary', userId], () => fetchSummary(published, `${published.url}/${encodeURIComponent(userId)}`), {
    enabled: Boolean(userId),
    retry: false,
  });

export function useSaveSummaryMutation(userId: string) {
  const client = useQueryClient();
  return useMutation((data: GetRequestType<typeof save>) => axios({ url: save.url, method: save.method, data }), {
    onSuccess: (_, summary) => {
      client.setQueryData(['profile-summary', userId], summary);
      client.invalidateQueries(['public-profile-summary', userId]);
    },
  });
}
