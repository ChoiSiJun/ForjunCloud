import { useQueryWithLoading } from '@config/hooks/useQueryWithLoading';
import { GetRequestType, GetResponseType } from '@common/utill/type-utils';
import axios from '@config/axios/axios';
import { HISTORY_API_ENDPOINTS } from './HistoryApi';

type HistoryQueryRequest = GetRequestType<typeof HISTORY_API_ENDPOINTS.getDetail>;
type HistoryQueryResponse = GetResponseType<typeof HISTORY_API_ENDPOINTS.getDetail>;

const fetchHistory = async (params: HistoryQueryRequest): Promise<HistoryQueryResponse> => {
  const response = await axios({
    method: HISTORY_API_ENDPOINTS.getDetail.method,
    url: `${HISTORY_API_ENDPOINTS.getDetail.url  }/${params.id}`,
    data: params,
  });

  return response.data;
};

const useHistoryQuery = (params: HistoryQueryRequest) => {
  return useQueryWithLoading<HistoryQueryResponse>({
    queryKey: ['history', params.id],
    queryFn: () => fetchHistory(params),
    enabled: !!params.id && params.id > 0,
  });
};

export default useHistoryQuery;
