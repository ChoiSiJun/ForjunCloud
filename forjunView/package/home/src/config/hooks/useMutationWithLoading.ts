import { AxiosError } from 'axios';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import { useNavigate } from 'react-router-dom';

import apiErrorHandler from '@config/handlers/apiErrorHandler';

const isHttpStatus = (error: unknown, status: number) =>
  error instanceof AxiosError && error.response?.status === status;

export const useMutationWithLoading = <TData = unknown, TError = unknown, TVariables = void>(
  options?: UseMutationOptions<TData, TError, TVariables>,
): UseMutationResult<TData, TError, TVariables> => {
  const navigate = useNavigate();

  return useMutation<TData, TError, TVariables>({
    ...options,
    retry:
      options?.retry ??
      ((failureCount, error) => {
        if (error instanceof AxiosError && [401, 403, 404].includes(error.response?.status ?? 0)) return false;
        return failureCount < 3;
      }),
    onError: (error, variables, context) => {
      if (isHttpStatus(error, 401)) {
        navigate('/login', { replace: true });
        return;
      }
      if (isHttpStatus(error, 403)) {
        navigate('/error', { replace: true });
        return;
      }
      if (options?.onError) options.onError(error, variables, context);
      else apiErrorHandler(error);
    },
  });
};
