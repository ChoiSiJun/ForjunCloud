// WepContentBox.tsx
import { Box } from '@mui/material';
import { ReactNode, forwardRef } from 'react';

interface WepContentBoxProps {
  color: string;
  bgColor: string;
  children: ReactNode;
}

const WepContentBox = forwardRef<HTMLDivElement, WepContentBoxProps>(
  ({ color, bgColor, children }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          height: '100%',
          width: '100%',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: bgColor,
          color,
          py: 4,
        }}
      >
        {children}
      </Box>
    );
  },
);

export default WepContentBox;
