import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/ReduxHooks';
import { confirmDialogClose } from '@store/slice/ConfirmDialogSlice';
import SjButton from '@common/ui/elements/button/SjButton';

const SjConfirmDialog = () => {
  const dispatch = useAppDispatch();
  const { open, content } = useAppSelector(state => state.ConfirmDialog);

  const handleClose = () => {
    dispatch(confirmDialogClose());
  };

  if (!open || !content) {
    return null;
  }

  const { title, message, onConfirm, confirmText = '확인', cancelText = '취소' } = content;

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 6,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          fontWeight: 'bold',
          fontSize: '1.25rem',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
        }}
      >
        <SjButton ButtonType="confirm" buttonName={confirmText} onClick={handleConfirm} />
        <SjButton ButtonType="cancel" buttonName={cancelText} onClick={handleClose} />
      </DialogActions>
    </Dialog>
  );
};

export default SjConfirmDialog;
