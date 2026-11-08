import { Box, Toolbar, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useAppSelector } from 'store/ReduxHooks';

export interface MirToolbarContentProps {
  buttonList: ReactNode[];
}

const MirToolbarContent = ({ buttonList }: MirToolbarContentProps) => {
  const menuName = useAppSelector(state => state.Menu.accessMenuName);
  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="h5" fontWeight="bold">
        {menuName}
      </Typography>
      <Box sx={{ display: 'flex', marginLeft: 'auto', gap: '5px' }}>
        {buttonList}
      </Box>
    </Toolbar>
  );
};

export default MirToolbarContent;
