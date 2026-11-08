import axios from '@config/axios/axios';
import { useMutationWithLoading } from '@config/hooks/useMutationWithLoading';
import { AxiosError } from 'axios';
import { USER_API_ENDPOINTS } from '@domain/user/api/userApi';
import { GetRequestType } from '@common/utill/type-utils';

type JoinUserParams = GetRequestType<typeof USER_API_ENDPOINTS.join>;
/**
 * 회원가입 뮤테이션 훅
 * @returns 회원가입 뮤테이션 훅
 */
export const useJoinUserMutation = () => {
  const endpoint = USER_API_ENDPOINTS.join;

  return useMutationWithLoading<void, AxiosError, JoinUserParams>({
    mutationFn: async (params: JoinUserParams) => {
      await axios({
        method: endpoint.method,
        url: endpoint.url,
        data: params,
        timeout: 5000,
      });
    },
  });
};
