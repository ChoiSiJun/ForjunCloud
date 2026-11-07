import { AxiosError } from 'axios';
import { useMutationWithLoading } from '@config/hooks/useMutationWithLoading';
import axios from '@config/axios/axios';
import { HISTORY_API_ENDPOINTS } from '@domain/history/api/HistoryApi';
import { GetRequestType } from '@common/utill/type-utils';

type UpdateHistoryRequest = GetRequestType<typeof HISTORY_API_ENDPOINTS.update>;

export const useUpdateHistoryMutation = () => {
  const fetchHistoryUpdate = async (params: UpdateHistoryRequest) => {
    const response = await axios({
      method: HISTORY_API_ENDPOINTS.update.method,
      url: `${HISTORY_API_ENDPOINTS.update.url  }/${  params.id}`,
      data: params,
    });
    return response.data;
  };

  return useMutationWithLoading<void, AxiosError, UpdateHistoryRequest>({
    mutationFn: async (params: UpdateHistoryRequest) => fetchHistoryUpdate(params),
  });
};
