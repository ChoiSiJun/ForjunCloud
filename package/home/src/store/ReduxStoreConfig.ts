import { combineReducers, configureStore } from '@reduxjs/toolkit';

import MenuSlice from 'store/slice/MenuSlice';
import AuthSlice from 'store/slice/AuthSlice';
import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import ModalSlice from 'store/slice/ModalSlice';
import LoadingSlice from 'store/slice/LoadingSlice';
import ConfirmDialogSlice from 'store/slice/ConfirmDialogSlice';

const reducers = combineReducers({
  Menu: MenuSlice,
  Auth: AuthSlice,
  Modal: ModalSlice,
  Loading: LoadingSlice,
  ConfirmDialog: ConfirmDialogSlice,
});

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['Auth'],
};

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
