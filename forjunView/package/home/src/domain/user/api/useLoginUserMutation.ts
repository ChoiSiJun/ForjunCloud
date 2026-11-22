import axios from '@config/axios/axios';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { USER_API_ENDPOINTS } from '@domain/user/api/userApi';
import { GetRequestType } from '@common/utill/type-utils';

type LoginUserParams = GetRequestType<typeof USER_API_ENDPOINTS.login>;
/**
 * 로그인 뮤테이션 훅
 * @returns 로그인 뮤테이션 훅
 */
export const useLoginUserMutation = () => {
  const endpoint = USER_API_ENDPOINTS.login;
  return useMutation<string, AxiosError, LoginUserParams>({
    retry: false,
    mutationFn: async (params: LoginUserParams) => {
      const response = await axios({
        url: endpoint.url,
        method: endpoint.method,
        data: params,
        timeout: 5000,
      });
      return response.data;
    },
  });
};
