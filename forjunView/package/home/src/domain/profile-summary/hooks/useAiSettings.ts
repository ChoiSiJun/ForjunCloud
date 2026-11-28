import { useAppSelector } from 'store/ReduxHooks';
import { useAiSettingsQuery, useDeleteAiSettingsMutation, useSaveAiSettingsMutation, useTestAiSettingsMutation } from '../api/useAiSummaryQueries';

export function useAiSettings() {
  const userId = useAppSelector(state => state.Auth.userId);
  return {
    settings: useAiSettingsQuery(userId),
    save: useSaveAiSettingsMutation(userId),
    remove: useDeleteAiSettingsMutation(userId),
    test: useTestAiSettingsMutation(),
  };
}
