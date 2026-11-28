import { lazy, Suspense } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from './routing/ProtectedRoute';
import RouteLoadingFallback from './routing/RouteLoadingFallback';

const AppContainer = lazy(() => import('@ui-kit/app/appContainer'));
const WebContainer = lazy(() => import('@ui-kit/app/webContainer'));
const Auth = lazy(() => import('@pages/auth'));
const Dashboard = lazy(() => import('@pages/dashboard'));
const Personal = lazy(() => import('@pages/personal'));
const ProfileSummary = lazy(() => import('@pages/profile-summary'));
const PublicProfileSummary = lazy(() => import('@pages/web/profile-summary'));
const UserEdit = lazy(() => import('@pages/user/edit'));
const UserSettings = lazy(() => import('@pages/user/settings'));
const UserPasswordSettings = lazy(() => import('@pages/user/settings/password'));
const UserAiSettings = lazy(() => import('@pages/user/settings/ai'));
const UserPrivacySettings = lazy(() => import('@pages/user/settings/privacy'));
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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="personal-statement" element={<Personal />} />
          <Route path="profile-summary" element={<ProfileSummary />} />
          <Route path="user/edit" element={<UserEdit />} />
          <Route path="user/settings" element={<UserSettings />} />
          <Route path="user/settings/password" element={<UserPasswordSettings />} />
          <Route path="user/settings/ai" element={<UserAiSettings />} />
          <Route path="user/settings/privacy" element={<UserPrivacySettings />} />
          <Route path="history/si" element={<SiHistory />} />
          <Route path="history/sm" element={<SmHistory />} />
          <Route path="history/rnd" element={<RndHistory />} />
          <Route path="history/toy" element={<ToyHistory />} />
        </Route>
      </Route>
      <Route path="web/:userId/profile" element={<WebContainer />}>
        <Route index element={<OpenPersonal />} />
        <Route path="personal" element={<OpenPersonal />} />
        <Route path="summary" element={<PublicProfileSummary />} />
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
