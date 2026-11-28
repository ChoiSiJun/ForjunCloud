import { useRef } from 'react';
import { AxiosError, isAxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import axios from '@config/axios/axios';
import { useMutationWithLoading } from '@config/hooks/useMutationWithLoading';
import { GetRequestType } from '@common/utill/type-utils';
import { USER_API_ENDPOINTS } from './userApi';

const { updateProfile, updatePrivacy, updatePassword } = USER_API_ENDPOINTS;

function useAccountSettingsMutation<Endpoint extends typeof updateProfile | typeof updatePrivacy>(endpoint: Endpoint) {
  const client = useQueryClient();
  return useMutationWithLoading<void, AxiosError, GetRequestType<Endpoint>>({
    mutationFn: async data => { await axios({ ...endpoint, data }); },
    retry: false,
    onError: () => {},
    onSuccess: async () => { await client.invalidateQueries(['user']); },
  });
}

export const useUpdateProfileMutation = () => useAccountSettingsMutation(updateProfile);
export const useUpdatePrivacyMutation = () => useAccountSettingsMutation(updatePrivacy);

type PasswordInput = GetRequestType<typeof updatePassword>;

export function useUpdatePasswordMutation() {
  const pending = useRef<PasswordInput>();
  const mutation = useMutation<void, Error>(async () => {
    const data = pending.current;
    pending.current = undefined;
    try {
      await axios({ ...updatePassword, data });
    } catch (error) {
      // Axios errors retain the request body. Keep only the server error code.
      const code = isAxiosError<{ code?: string }>(error) ? error.response?.data?.code : undefined;
      throw new Error(code ?? 'PASSWORD_UPDATE_FAILED');
    }
  }, { retry: false });

  return (data: PasswordInput) => {
    pending.current = data;
    return mutation.mutateAsync();
  };
}
