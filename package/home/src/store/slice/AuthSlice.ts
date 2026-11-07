import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

export interface AuthProps {
  jwtToken: string;
  userId: string;
  name: string;
  role: string;
  status: string;
  exp: number | null;
}

const initialState: AuthProps = {
  jwtToken: '',
  userId: 'GUEST',
  name: 'GUEST',
  role: 'GUEST',
  status: 'idle',
  exp: null,
};

interface JwtPayload {
  sub?: string;
  userName?: string;
  authority?: string;
  exp?: number;
}

export const isTokenExpired = (exp: number | null, now = Date.now()) =>
  exp === null || exp * 1000 <= now;

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 인증값 저장
    authInsert: (state, action: PayloadAction<string>) => {
      const jwtToken = action.payload;

      try {
        const decodedJwt = jwtDecode<JwtPayload>(jwtToken);
        if (!decodedJwt.sub || !decodedJwt.exp || isTokenExpired(decodedJwt.exp)) {
          Object.assign(state, initialState, { status: 'fail' });
          return;
        }

        state.jwtToken = jwtToken;
        state.userId = decodedJwt.sub;
        state.name = decodedJwt.userName ?? '';
        state.role = decodedJwt.authority ?? '';
        state.exp = decodedJwt.exp;
        state.status = 'success';
      } catch {
        Object.assign(state, initialState, { status: 'fail' });
      }
    },

    // 인증값 삭제
    authDelete: state => {
      Object.assign(state, initialState);
    },
  },
});

export const { authInsert, authDelete } = AuthSlice.actions;
export default AuthSlice.reducer;
