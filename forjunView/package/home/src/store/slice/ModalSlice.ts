import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

export interface ModalSliceProps {
  open: boolean;
  content?: ReactNode;
}

const initialState: ModalSliceProps = {
  open: false,
  content: undefined,
};

const ModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalOpen(state, action: PayloadAction<ReactNode>) {
      state.open = true;
      state.content = action.payload;
    },
    modalClose(state) {
      state.open = false;
      state.content = undefined;
    },
  },
});

export const { modalOpen, modalClose } = ModalSlice.actions;

export default ModalSlice.reducer;
