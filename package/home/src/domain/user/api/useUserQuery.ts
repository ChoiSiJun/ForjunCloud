import axios from '@config/axios/axios';
import { useQueryWithLoading } from '@config/hooks/useQueryWithLoading';
import { GetResponseType } from '@common/utill/type-utils';
import { USER_API_ENDPOINTS } from './userApi';

const END_POINT = USER_API_ENDPOINTS.get;

type UserResponse = GetResponseType<typeof END_POINT>;

const fetchUser = async (): Promise<UserResponse> => {
  const response = await axios({
    method: END_POINT.method,
    url: END_POINT.url,
  });

  return response.data;
};

const useUserQuery = (enabled: boolean = true) => {
  return useQueryWithLoading<UserResponse>({
    queryKey: ['user'],
    queryFn: () => fetchUser(),
    enabled,
  });
};

export default useUserQuery;

