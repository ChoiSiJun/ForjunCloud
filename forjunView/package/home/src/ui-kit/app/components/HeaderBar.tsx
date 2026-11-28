import Toolbar from '@mui/material/Toolbar';
import { useMediaQuery, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Mui AppBar Type
interface AppBarProps extends MuiAppBarProps {
  headerBarHeight: number;
  sidebarWidth: number;
  open?: boolean;
}

// Mui AppBar 스타일 정의 컴포넌트
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open' && prop !== 'sidebarWidth',
})<AppBarProps>(({ theme, open, sidebarWidth, headerBarHeight }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: sidebarWidth,
    width: `calc(100% - ${sidebarWidth}px)`,
    height: headerBarHeight,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Liberty HeaderBar Type
interface HeaderBarProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  headerBarHeight: number;
  sidebarWidth: number;
  title: string;
  onLogout: () => void;
}

// Liberty HeaderBar 컴포넌트
const HeaderBar = ({ title, headerBarHeight, sidebarWidth, setSidebarOpen, isSidebarOpen, onLogout }: HeaderBarProps) => {
  const currentTheme = useTheme(); // 현재 테마 객체 가져오기
  const lgUp = useMediaQuery(currentTheme.breakpoints.up('lg'));
  const navigate = useNavigate();

  const HandleMobileSideOpen = () => {
    if (isSidebarOpen === false) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  };

  const handleSettingsClick = () => {
    navigate('/forjun/user/settings');
  };

  return (
    <AppBar position="absolute" open={isSidebarOpen} sidebarWidth={lgUp ? sidebarWidth : 0} headerBarHeight={headerBarHeight}>
      <Toolbar
        sx={{
          minHeight: `${headerBarHeight}px`, // Toolbar 높이 설정
          height: `${headerBarHeight}px`, // Toolbar 높이 설정
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: '24px', // keep right padding when drawer closed
          pl: '24px', // left padding 추가
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={HandleMobileSideOpen}
          sx={{
            marginRight: { xs: 1, sm: '36px' },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h4" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Tooltip title="개인정보 설정">
          <IconButton color="inherit" onClick={handleSettingsClick} aria-label="개인정보 설정">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="로그아웃">
          <IconButton color="inherit" onClick={onLogout} aria-label="로그아웃">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
