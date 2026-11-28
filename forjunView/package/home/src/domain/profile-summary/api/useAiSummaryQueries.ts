import { useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { isAxiosError } from 'axios';
import axios from '@config/axios/axios';
import { GetRequestType, GetResponseType } from '@common/utill/type-utils';
import { PROFILE_SUMMARY_API } from './profileSummaryApi';

const { aiSettings, saveAiSettings, deleteAiSettings, testAiSettings, generateAiSummary } = PROFILE_SUMMARY_API;

const settingsKey = (userId: string) => ['profile-summary-ai-settings', userId];

const settingsErrorCodes = [
  'PROFILE_AI_SETTINGS_BODY_INVALID',
  'PROFILE_AI_SETTINGS_URL_INVALID',
  'PROFILE_AI_SETTINGS_MODEL_INVALID',
  'PROFILE_AI_SETTINGS_KEY_REQUIRED',
  'PROFILE_AI_SETTINGS_KEY_INVALID',
] as const;

export type AiSettingsErrorCode = typeof settingsErrorCodes[number];

export class SaveAiSettingsError extends Error {
  constructor(readonly invalidRequest: boolean, readonly code?: AiSettingsErrorCode) {
    super('AI settings save failed');
  }
}

export const useAiSettingsQuery = (userId: string) => useQuery(settingsKey(userId), async () => {
  const { data } = await axios<GetResponseType<typeof aiSettings>>(aiSettings);
  return data;
}, { enabled: Boolean(userId), retry: false });

export function useSaveAiSettingsMutation(userId: string) {
  const client = useQueryClient();
  type Settings = Omit<GetRequestType<typeof saveAiSettings>, 'apiKey'>;
  const pendingKeys = useRef(new WeakMap<Settings, string>());
  const mutation = useMutation(async (settings: Settings) => {
    const apiKey = pendingKeys.current.get(settings);
    pendingKeys.current.delete(settings);
    try {
      const response = await axios<GetResponseType<typeof saveAiSettings>>({
        ...saveAiSettings,
        data: { ...settings, ...(apiKey && { apiKey }) },
      });
      return response.data;
    } catch (error) {
      // Axios errors retain request data. Only pass recognized validation codes to the mutation cache.
      const response = isAxiosError<{ code?: unknown }>(error) ? error.response : undefined;
      const invalidRequest = response?.status === 400;
      const code = invalidRequest ? settingsErrorCodes.find(allowed => allowed === response?.data?.code) : undefined;
      throw new SaveAiSettingsError(invalidRequest, code);
    }
  }, {
    retry: false,
    onSuccess: async data => {
      await client.cancelQueries(settingsKey(userId));
      client.setQueryData(settingsKey(userId), data);
    },
  });
  return {
    isLoading: mutation.isLoading,
    mutateAsync: ({ apiKey, ...settings }: GetRequestType<typeof saveAiSettings>) => {
      if (apiKey) pendingKeys.current.set(settings, apiKey);
      return mutation.mutateAsync(settings).finally(() => pendingKeys.current.delete(settings));
    },
  };
}

export function useDeleteAiSettingsMutation(userId: string) {
  const client = useQueryClient();
  return useMutation(() => axios(deleteAiSettings), {
    onSuccess: async () => {
      await client.cancelQueries(settingsKey(userId));
      client.setQueryData(settingsKey(userId), { baseUrl: '', model: '', hasApiKey: false });
    },
  });
}

export const useTestAiSettingsMutation = () => useMutation(() => axios({ ...testAiSettings, timeout: 30000 }));

export const useGenerateAiSummaryMutation = () => useMutation(async (data: GetRequestType<typeof generateAiSummary>) => {
  const response = await axios<GetResponseType<typeof generateAiSummary>>({ ...generateAiSummary, data, timeout: 60000 });
  return response.data;
});
