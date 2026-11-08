import axios from '@config/axios/axios';
import { useMutationWithLoading } from '@config/hooks/useMutationWithLoading';
import { AxiosError } from 'axios';
import { USER_API_ENDPOINTS } from '@domain/user/api/userApi';
import { GetRequestType } from '@common/utill/type-utils';
import { authInsert } from '@store/slice/AuthSlice';
import { useAppDispatch } from '@store/ReduxHooks';

type LoginUserParams = GetRequestType<typeof USER_API_ENDPOINTS.login>;
/**
 * 로그인 뮤테이션 훅
 * @returns 로그인 뮤테이션 훅
 */
export const useLoginUserMutation = () => {
  const dispatch = useAppDispatch();

  const endpoint = USER_API_ENDPOINTS.login;
  return useMutationWithLoading<string, AxiosError, LoginUserParams>({
    mutationFn: async (params: LoginUserParams) => {
      const response = await axios({
        url: endpoint.url,
        method: endpoint.method,
        data: params,
        timeout: 5000,
      });
      return response.data;
    },

    onSuccess: data => {
      dispatch(authInsert(data));
    },
  });
};
