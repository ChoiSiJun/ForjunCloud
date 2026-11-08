// @api/config/axios.ts
import store from '@store/ReduxStoreConfig';
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_REST_API,
  timeout: 5000,
});

instance.interceptors.request.use(
  config => {
    // Redux 스토어에서 JWT 값 가져오기
    const state = store.getState();
    const jwt = state.Auth.jwtToken;

    // 토큰이 존재하면 Authorization 헤더에 추가
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default instance;
