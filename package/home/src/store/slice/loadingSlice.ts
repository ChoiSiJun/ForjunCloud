import { createSlice } from '@reduxjs/toolkit';

// LoadingState (개선)
export interface LoadingState {
  globalCount: number; // 폼 렌더링을 막아야 하는 치명적인 로딩 (주로 데이터 조회)
  mutationCount: number; // 저장, 수정 등 가벼운 로딩 (주로 버튼이나 컴포넌트 내부에서 처리)
}

const initialState: LoadingState = {
  globalCount: 0,
  mutationCount: 0,
};

const LoadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    globalLoadingOn: state => {
      state.globalCount += 1;
    },
    globalLoadingOff: state => {
      state.globalCount = Math.max(0, state.globalCount - 1);
    },
    mutationLoadingOn: state => {
      state.mutationCount += 1;
    },
    mutationLoadingOff: state => {
      state.mutationCount = Math.max(0, state.mutationCount - 1);
    },
  },
});

export const {
  globalLoadingOn,
  globalLoadingOff,
  mutationLoadingOn,
  mutationLoadingOff,
} = LoadingSlice.actions;
export default LoadingSlice.reducer;
