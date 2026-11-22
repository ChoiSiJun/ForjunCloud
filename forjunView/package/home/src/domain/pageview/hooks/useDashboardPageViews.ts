import { useAppSelector } from 'store/ReduxHooks';
import { usePageViewSummaryQuery } from '../api/usePageViewQueries';

export default function useDashboardPageViews() {
  const userId = useAppSelector(state => state.Auth.userId);
  return usePageViewSummaryQuery(userId);
}
