import { HISTORY_API_ENDPOINTS } from '@domain/history/api/HistoryApi';
import { useQueryWithLoading } from '@config/hooks/useQueryWithLoading';
import { GetResponseType, GetRequestType } from '@common/utill/type-utils';
import axios from '@config/axios/axios';

type HistoryWebListRequest = GetRequestType<typeof HISTORY_API_ENDPOINTS.getPublicList>;
type HistoryWebListResponse = GetResponseType<typeof HISTORY_API_ENDPOINTS.getPublicList>;

const fetchHistoryList = async (params: HistoryWebListRequest): Promise<HistoryWebListResponse[]> => {
  const response = await axios({
    method: HISTORY_API_ENDPOINTS.getPublicList.method,
    params,
    url: HISTORY_API_ENDPOINTS.getPublicList.url,
  });

  return response.data;
};

export const useWebHistoryListQuery = (params: HistoryWebListRequest) => {
  return useQueryWithLoading<HistoryWebListResponse[]>({
    queryKey: ['history', params.userId, params.category],
    queryFn: () => fetchHistoryList(params),
  });
};
