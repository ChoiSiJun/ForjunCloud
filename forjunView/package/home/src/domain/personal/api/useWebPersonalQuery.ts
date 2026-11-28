// personalApi.ts 파일에 정의된 EndPoint 객체와 타입 가져오기
import axios from '@config/axios/axios';
import { isAxiosError } from 'axios';
import { useQueryWithLoading } from '@config/hooks/useQueryWithLoading';
import { PERSONAL_API_ENDPOINTS, PersonalPublicDetailRequest } from '@domain/personal/api/personalApi';
import { GetResponseType } from '@common/utill/type-utils';

const END_POINT = PERSONAL_API_ENDPOINTS.getPublic;

type PersonalResponse = GetResponseType<typeof END_POINT>;

const fetchPersonal = async (params: PersonalPublicDetailRequest): Promise<PersonalResponse | null> => {
  if (!params.userId) return null;
  try {
    const response = await axios({
      method: END_POINT.method,
      url: `${END_POINT.url}/${encodeURIComponent(params.userId)}`,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError<{ code?: string }>(error)) {
      const { status, data } = error.response ?? {};
      if (status === 403 || (status === 404 && data?.code === 'PERSONAL_NOT_FOUND')) return null;
    }
    throw error;
  }
};

const useWebPersonalQuery = (params: PersonalPublicDetailRequest) => {
  return useQueryWithLoading<PersonalResponse | null>({
    queryKey: ['personal', params.userId],
    queryFn: () => fetchPersonal(params),
    enabled: Boolean(params.userId),
  });
};

export default useWebPersonalQuery;
