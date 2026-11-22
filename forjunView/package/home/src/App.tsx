import ReactDOM from 'react-dom/client';
import ForjunRouter from '@router';
import { Provider } from 'react-redux';
import { persistor, store } from 'store/ReduxStoreConfig';
import { PersistGate } from 'redux-persist/integration/react';

import 'react-toastify/dist/ReactToastify.css';
import Toast from '@ui-kit/app/components/feedback/ReactToast';

import { QueryClientProvider, QueryClient } from 'react-query';
import Modal from '@ui-kit/app/components/feedback/Modal';
import SjConfirmDialog from '@ui-kit/app/components/feedback/SjConfirmDialog';
import GlobalMutationLoading from '@ui-kit/app/components/feedback/GlobalMutationLoading';
import GlobalQueryLoadingWrapper from '@ui-kit/app/components/feedback/GlobalQueryLoadingWrapper';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
          <GlobalQueryLoadingWrapper>
            <ForjunRouter />
          </GlobalQueryLoadingWrapper>
        </PersistGate>
        <Toast />
        <Modal />
        <SjConfirmDialog />
        <GlobalMutationLoading />
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>,
);
