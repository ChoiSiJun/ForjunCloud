import { lazy, Suspense } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from '@common/ui/templates/ProtectedRoute';
import RouteLoadingFallback from '@common/ui/templates/RouteLoadingFallback';

const AppContainer = lazy(() => import('@ui-kit/app/appContainer'));
const WebContainer = lazy(() => import('@ui-kit/app/webContainer'));
const Auth = lazy(() => import('@pages/auth'));
const Personal = lazy(() => import('@pages/personal'));
const UserEdit = lazy(() => import('@pages/user/edit'));
const ErrorPage = lazy(() => import('@pages/error'));
const OpenPersonal = lazy(() => import('@pages/web/personal'));
const SiHistory = lazy(() => import('@pages/history/si').then(module => ({ default: module.SiHistory })));
const SmHistory = lazy(() => import('@pages/history/sm').then(module => ({ default: module.SmHistory })));
const RndHistory = lazy(() => import('@pages/history/rnd').then(module => ({ default: module.RndHistory })));
const ToyHistory = lazy(() => import('@pages/history/toy').then(module => ({ default: module.ToyHistory })));
const OpenSiHistory = lazy(() => import('@pages/web/history/si').then(module => ({ default: module.OpenSiHistory })));
const OpenSmHistory = lazy(() => import('@pages/web/history/sm').then(module => ({ default: module.OpenSmHistory })));
const OpenRndHistory = lazy(() => import('@pages/web/history/rnd').then(module => ({ default: module.OpenRndHistory })));
const OpenToyHistory = lazy(() => import('@pages/web/history/toy').then(module => ({ default: module.OpenToyHistory })));

const ForjunRouter = () => (
  <Suspense fallback={<RouteLoadingFallback />}>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="login" element={<Auth />} />
      <Route element={<ProtectedRoute />}>
        <Route path="forjun/*" element={<AppContainer />}>
          <Route index element={<Personal />} />
          <Route path="personal" element={<Personal />} />
          <Route path="user/edit" element={<UserEdit />} />
          <Route path="history/si" element={<SiHistory />} />
          <Route path="history/sm" element={<SmHistory />} />
          <Route path="history/rnd" element={<RndHistory />} />
          <Route path="history/toy" element={<ToyHistory />} />
        </Route>
      </Route>
      <Route path="web/:userId/profile" element={<WebContainer />}>
        <Route index element={<OpenPersonal />} />
        <Route path="personal" element={<OpenPersonal />} />
        <Route path="history/si" element={<OpenSiHistory />} />
        <Route path="history/sm" element={<OpenSmHistory />} />
        <Route path="history/rnd" element={<OpenRndHistory />} />
        <Route path="history/toy" element={<OpenToyHistory />} />
      </Route>
      <Route path="error" element={<ErrorPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />}
  </Suspense>
);

export default ForjunRouter;
