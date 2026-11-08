import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export interface ConfirmDialogSliceProps {
  open: boolean;
  content?: ConfirmDialogProps;
}

const initialState: ConfirmDialogSliceProps = {
  open: false,
  content: undefined,
};

const ConfirmDialogSlice = createSlice({
  name: 'confirmDialog',
  initialState,
  reducers: {
    confirmDialogOpen(state, action: PayloadAction<ConfirmDialogProps>) {
      state.open = true;
      state.content = action.payload;
    },
    confirmDialogClose(state) {
      state.open = false;
      state.content = undefined;
    },
  },
});

export const { confirmDialogOpen, confirmDialogClose } = ConfirmDialogSlice.actions;

export default ConfirmDialogSlice.reducer;

