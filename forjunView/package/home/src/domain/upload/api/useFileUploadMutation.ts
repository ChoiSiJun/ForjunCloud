import { useMutationWithLoading } from '@config/hooks/useMutationWithLoading';
import { AxiosError } from 'axios';
import axios from '@config/axios/axios';
import { GetRequestType, GetResponseType } from '@common/utill/type-utils';
import { FILE_UPLOAD_API_ENDPOINTS } from './FileUploadApi';

const END_POINT = FILE_UPLOAD_API_ENDPOINTS.upload;

type UploadReq = GetRequestType<typeof END_POINT>;
type UploadRes = GetResponseType<typeof END_POINT>;

// 파일 업로드 Mutation
const useFileUploadMutation = () => {
  return useMutationWithLoading<UploadRes, AxiosError, UploadReq>({
    retry: false,
    mutationFn: async ({ uploadFile, directory = '' }) => {
      if (uploadFile == null) {
        throw Error('파일이 비어있습니다.');
      }

      // 파일 데이터 Multi Form 형태로 변환
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('directory', directory);

      const response = await axios<UploadRes>({
        method: END_POINT.method,
        url: END_POINT.url,
        data: formData,
      });
      return response.data;
    },
  });
};

export default useFileUploadMutation;
