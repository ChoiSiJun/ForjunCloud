import axios from '@config/axios/axios';
import { useMutationWithLoading } from '@config/hooks/useMutationWithLoading';
import { AxiosError } from 'axios';
import { GetRequestType } from '@common/utill/type-utils';
import { USER_API_ENDPOINTS } from './userApi';

type UpdateUserParams = GetRequestType<typeof USER_API_ENDPOINTS.update>;

/**
 * 사용자 정보 수정 뮤테이션 훅
 * @returns 사용자 정보 수정 뮤테이션 훅
 */
export const useUpdateUserMutation = () => {
  const endpoint = USER_API_ENDPOINTS.update;

  return useMutationWithLoading<void, AxiosError, UpdateUserParams>({
    mutationFn: async (params: UpdateUserParams) => {
      await axios({
        method: endpoint.method,
        url: endpoint.url,
        data: params,
        timeout: 5000,
      });
    },
  });
};

