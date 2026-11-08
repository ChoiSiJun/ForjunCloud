import { AxiosError } from 'axios';
import { useMutationWithLoading } from '@config/hooks/useMutationWithLoading';
import axios from '@config/axios/axios';
import { HISTORY_API_ENDPOINTS } from '@domain/history/api/HistoryApi';
import { GetRequestType } from '@common/utill/type-utils';

type DeleteHistoryRequest = GetRequestType<typeof HISTORY_API_ENDPOINTS.delete>;

export const useDeleteHistoryMutation = () => {
  const fetchDeleteHistory = async (params: DeleteHistoryRequest) => {
    const response = await axios({
      method: HISTORY_API_ENDPOINTS.delete.method,
      url: `${HISTORY_API_ENDPOINTS.delete.url  }/${  params.id}`,
    });
    return response.data;
  };

  return useMutationWithLoading<void, AxiosError, DeleteHistoryRequest>({
    mutationFn: async (params: DeleteHistoryRequest) => fetchDeleteHistory(params),
  });
};
