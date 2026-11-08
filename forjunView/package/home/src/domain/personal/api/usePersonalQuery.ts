// personalApi.ts 파일에 정의된 EndPoint 객체와 타입 가져오기
import axios from '@config/axios/axios';
import { useQueryWithLoading } from '@config/hooks/useQueryWithLoading';
import { GetResponseType } from '@common/utill/type-utils';
import { PERSONAL_API_ENDPOINTS } from './personalApi';

const END_POINT = PERSONAL_API_ENDPOINTS.get;

type PersonalResponse = GetResponseType<typeof END_POINT>;

export const fetchPersonal = async (): Promise<PersonalResponse> => {
  const response = await axios({
    method: END_POINT.method,
    url: END_POINT.url,
  });

  return response.data;
};

const usePersonalQuery = () => {
  return useQueryWithLoading<PersonalResponse>({
    queryKey: ['personal'],
    queryFn: () => fetchPersonal(),
  });
};

export default usePersonalQuery;
