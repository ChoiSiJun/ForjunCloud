// components/CommonModal.tsx
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '@store/ReduxHooks';
import { modalClose } from '@store/slice/ModalSlice';

const Modal = () => {
  const dispatch = useAppDispatch();
  const { open, content } = useAppSelector(state => state.Modal);

  const handleClose = () => {
    dispatch(modalClose());
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
};

export default Modal;
