import axios from '@config/axios/axios';
import { useQueryWithLoading } from '@config/hooks/useQueryWithLoading';
import { USER_API_ENDPOINTS } from '@domain/user/api/userApi';
import { GetRequestType } from '@common/utill/type-utils';

type DuplicateIdCheckUserParams = GetRequestType<typeof USER_API_ENDPOINTS.duplicateCheckId>;

export const fetchIdDuplicateCheck = async (userId: string): Promise<boolean> => {
  const endpoint = USER_API_ENDPOINTS.duplicateCheckId;
  const response = await axios({
    method: endpoint.method,
    url: endpoint.url,
    params: { userId },
  });

  return response.data;
};

/**
 * ID 중복 체크 쿼리 훅
 * @param {DuplicateIdCheckParams} params - 중복 체크할 사용자 ID
 * @returns {UseQueryResult<boolean>} 중복 체크 결과
 */
export const useDuplicateIdCheckUserQuery = ({ userId }: DuplicateIdCheckUserParams) => {
  return useQueryWithLoading<boolean>({
    queryKey: ['idDuplicateCheck', userId],
    queryFn: () => fetchIdDuplicateCheck(userId),
    enabled: false,
  });
};
