import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from 'store/ReduxHooks';
import { PublicPage } from '../api/pageViewApi';
import { recordPageView } from '../api/usePageViewQueries';

export default function useRecordPublicPageView(userId: string | undefined, page: PublicPage, visible: boolean) {
  const { key, pathname } = useLocation();
  const auth = useAppSelector(state => state.Auth);
  const visit = `${key}:${pathname}:${page}`;
  const lastVisit = useRef<string>();

  useEffect(() => {
    if (!visible || !userId || lastVisit.current === visit) return;
    lastVisit.current = visit;
    if (auth.status === 'success' && auth.userId === userId) return;

    const eventId = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
    // A tracking failure must not interrupt the public page.
    recordPageView({ eventId, userId, page }).catch(() => undefined);
  }, [auth.status, auth.userId, page, userId, visible, visit]);
}
