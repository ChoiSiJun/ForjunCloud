// personalApi.ts 파일에 정의된 EndPoint 객체와 타입 가져오기
import axios from '@config/axios/axios';
import { useQueryWithLoading } from '@config/hooks/useQueryWithLoading';
import { PERSONAL_API_ENDPOINTS, PersonalPublicDetailRequest } from '@domain/personal/api/personalApi';
import { GetResponseType } from '@common/utill/type-utils';

const END_POINT = PERSONAL_API_ENDPOINTS.getPublic;

type PersonalResponse = GetResponseType<typeof END_POINT>;

const fetchPersonal = async (params: PersonalPublicDetailRequest): Promise<PersonalResponse> => {
  const response = await axios({
    method: END_POINT.method,
    url: `${END_POINT.url  }/${  params.userId}`,
  });

  return response.data;
};

const useWebPersonalQuery = (params: PersonalPublicDetailRequest) => {
  return useQueryWithLoading<PersonalResponse>({
    queryKey: ['personal', params.userId],
    queryFn: () => fetchPersonal(params),
  });
};

export default useWebPersonalQuery;
