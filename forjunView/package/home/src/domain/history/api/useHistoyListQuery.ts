import { HISTORY_API_ENDPOINTS } from '@domain/history/api/HistoryApi';
import { useQueryWithLoading } from '@config/hooks/useQueryWithLoading';
import { GetResponseType, GetRequestType } from '@common/utill/type-utils';
import axios from '@config/axios/axios';

type HistoryListRequest = GetRequestType<typeof HISTORY_API_ENDPOINTS.get>;
type HistoryListResponse = GetResponseType<typeof HISTORY_API_ENDPOINTS.get>;

const fetchHistoryList = async (params: HistoryListRequest): Promise<HistoryListResponse[]> => {
  const response = await axios({
    method: HISTORY_API_ENDPOINTS.get.method,
    params,
    url: HISTORY_API_ENDPOINTS.get.url,
  });

  return response.data;
};

export const useHistoryListQuery = (params: HistoryListRequest) => {
  return useQueryWithLoading<HistoryListResponse[]>({
    queryKey: ['history', params.category],
    queryFn: () => fetchHistoryList(params),
  });
};
