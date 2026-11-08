import { useMediaQuery, Box, Drawer, useTheme, Divider } from '@mui/material';
import SideBarHeader from '@ui-kit/app/components/SideBar/SideBarHeader';
import ItemContainer from '@ui-kit/app/components/SideBar/ItemContainer';

interface SidebarProps {
  sidebarWidth: number;
  isSidebarOpen: boolean;
  onSidebarClose: () => void;
}

const Sidebar = ({ sidebarWidth, isSidebarOpen, onSidebarClose }: SidebarProps) => {
  const currentTheme = useTheme(); // 현재 테마 객체 가져오기
  const lgUp = useMediaQuery(currentTheme.breakpoints.up('lg'));

  // 모던한 사이드바 스타일
  const sidebarPaperStyles = {
    width: sidebarWidth,
    boxSizing: 'border-box',
    background: `linear-gradient(180deg, 
      ${currentTheme.palette.background.paper} 0%, 
      ${currentTheme.palette.grey[50]} 50%,
      ${currentTheme.palette.background.paper} 100%)`,
    borderRight: `1px solid ${currentTheme.palette.divider}`,
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '120px',
      background: `linear-gradient(135deg, 
        rgba(33, 67, 143, 0.03) 0%, 
        rgba(73, 190, 255, 0.02) 50%,
        rgba(33, 67, 143, 0.01) 100%)`,
      pointerEvents: 'none',
      zIndex: 0,
    },
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(0, 0, 0, 0.15)',
      borderRadius: '10px',
      '&:hover': {
        background: 'rgba(0, 0, 0, 0.25)',
      },
    },
  };

  if (lgUp) {
    /* 데스크탑 사이드바 */
    return (
      <Drawer
        open={isSidebarOpen}
        onClose={onSidebarClose}
        anchor="left"
        variant="persistent"
        PaperProps={{
          sx: {
            ...sidebarPaperStyles,
            position: 'fixed',
            top: 0,
            left: 0,
            transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            visibility: isSidebarOpen ? 'visible' : 'hidden',
          },
        }}
        sx={{
          width: 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* 헤더 영역 */}
          <Box
            sx={{
              px: 3,
              py: 3,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <SideBarHeader />
          </Box>

          {/* 구분선 */}
          <Divider
            sx={{
              borderColor: currentTheme.palette.divider,
              mx: 2.5,
              opacity: 0.5,
            }}
          />

          {/* 메뉴 영역 */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              py: 2,
              position: 'relative',
              zIndex: 1,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.25)',
                },
              },
            }}
          >
            <ItemContainer />
          </Box>
        </Box>
      </Drawer>
    );
  }

  /* 모바일 사이드바 */
  return (
    <Drawer
      anchor="left"
      open={isSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          ...sidebarPaperStyles,
          marginTop: '60px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        },
      }}
      ModalProps={{
        keepMounted: true, // 모바일에서 성능 향상
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 헤더 영역 */}
        <Box
          sx={{
            px: 2,
            py: 3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <SideBarHeader />
        </Box>

        {/* 구분선 */}
        <Divider
          sx={{
            borderColor: currentTheme.palette.divider,
            mx: 2,
            opacity: 0.5,
          }}
        />

        {/* 메뉴 영역 */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            py: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <ItemContainer />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
