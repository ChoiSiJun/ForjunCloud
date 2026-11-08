import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { useNavigate } from 'react-router-dom';

import apiErrorHandler from '@config/handlers/apiErrorHandler';

export const useQueryWithLoading = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>): UseQueryResult<TData, TError> => {
  const navigate = useNavigate();

  return useQuery({
    ...options,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && [401, 403, 404].includes(error.response?.status ?? 0)) return false;
      return failureCount < 3;
    },
    onError: error => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      if (error instanceof AxiosError && error.response?.status === 403) {
        navigate('/error', { replace: true });
        return;
      }
      if (options.onError) options.onError(error);
      else apiErrorHandler(error);
    },
  });
};
