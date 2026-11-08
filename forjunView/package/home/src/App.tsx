import ReactDOM from 'react-dom/client';
import ForjunRouter from '@router';
import { Provider } from 'react-redux';
import { store } from 'store/ReduxStoreConfig';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import 'react-toastify/dist/ReactToastify.css';
import Toast from '@common/ui/elements/feedback/ReactToast';

import { QueryClientProvider, QueryClient } from 'react-query';
import Modal from '@common/ui/modules/Modal';
import SjConfirmDialog from '@common/ui/modules/SjConfirmDialog';
import GlobalMutationLoading from '@common/ui/template/GlobalMutationLoading';
import GlobalQueryLoadingWrapper from '@common/ui/template/GlobalQueryLoadingWrapper';
import { BrowserRouter } from 'react-router-dom';

const persistor = persistStore(store);

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
