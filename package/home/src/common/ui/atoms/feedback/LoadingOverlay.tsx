import { Box, CircularProgress } from '@mui/material';

interface LoadingOverlayProps {
  label?: string;
}

const LoadingOverlay = ({ label = '처리 중' }: LoadingOverlayProps) => (
  <Box
    role="status"
    aria-live="polite"
    aria-label={label}
    sx={{
      position: 'fixed',
      inset: 0,
      zIndex: theme => theme.zIndex.modal + 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.72)',
    }}
  >
    <CircularProgress size={56} />
  </Box>
);

export default LoadingOverlay;
