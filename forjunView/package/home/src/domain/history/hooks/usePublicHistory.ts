import { useWebHistoryListQuery } from '../api/useWebHistoyQuery';

const usePublicHistory = ({ category, userId }: Parameters<typeof useWebHistoryListQuery>[0]) =>
  useWebHistoryListQuery({ category, userId });

export default usePublicHistory;