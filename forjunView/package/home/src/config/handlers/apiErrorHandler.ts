// @hooks/apiErrorHandler.ts
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const apiErrorHandler = (error: unknown) => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as { message?: string } | undefined;
    const message = responseData?.message || error.message;
    toast.error(message);
    return;
  }
  toast.error('예상치 못한 오류가 발생했습니다.');
};

export default apiErrorHandler;
