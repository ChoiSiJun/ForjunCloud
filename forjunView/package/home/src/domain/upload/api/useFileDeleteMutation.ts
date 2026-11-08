import { useMutationWithLoading } from '@config/hooks/useMutationWithLoading';
import { AxiosError } from 'axios';
import axios from '@config/axios/axios';
import { GetRequestType, GetResponseType } from '@common/utill/type-utils';
import { FILE_UPLOAD_API_ENDPOINTS } from './FileUploadApi';

const END_POINT = FILE_UPLOAD_API_ENDPOINTS.delete;

type DeleteReq = GetRequestType<typeof END_POINT>;
type DeleteRes = GetResponseType<typeof END_POINT>;

// 파일 삭제 Mutation
const useFileDeleteMutation = () => {
  return useMutationWithLoading<DeleteRes, AxiosError, DeleteReq>({
    mutationFn: async fileId => {
      if (fileId == null) {
        throw Error('삭제할 대상이 없습니다.');
      }

      await axios<DeleteRes>({
        method: END_POINT.method,
        url: `${END_POINT.url  }/${fileId}`,
      });
    },
  });
};

export default useFileDeleteMutation;
