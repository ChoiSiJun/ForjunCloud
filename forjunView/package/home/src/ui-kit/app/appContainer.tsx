import { useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import HeaderBar from '@ui-kit/app/components/HeaderBar';
import SideBar from '@ui-kit/app/components/SideBar/Sidebar';

import { appTheme } from '@ui-kit/app/themes/appTheme';
import Container from '@mui/material/Container';

import { useMediaQuery } from '@mui/material';

// 라우터 Import
import { Outlet } from 'react-router-dom';
import GlobalQueryLoadingWrapper from '@common/ui/template/GlobalQueryLoadingWrapper';

// 헤더바 높이
const headerBarHeight: number = 70;

// 사이드바 기본 확장 넓이
const sidebarWidth: number = 270;

export default function AppContainer() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery(appTheme.breakpoints.up('lg'));

  return (
    <ThemeProvider theme={appTheme}>
      <Box sx={{ display: 'flex', width: '100%', position: 'relative' }}>
        <CssBaseline />

        <SideBar
          sidebarWidth={sidebarWidth}
          isSidebarOpen={isSidebarOpen}
          onSidebarClose={() => setSidebarOpen(false)}
        />

        <Box
          component="main"
          sx={{
            backgroundColor: theme =>
              theme.palette.mode === 'light'
                ? 'white'
                : theme.palette.grey[900],
            flexGrow: 1,
            minWidth: 0,
            height: '100vh',
            overflow: 'auto',
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginLeft: isDesktop && isSidebarOpen ? `${sidebarWidth}px` : '0',
            width: '100%',
          }}
        >
          <HeaderBar
            setSidebarOpen={setSidebarOpen}
            headerBarHeight={headerBarHeight}
            isSidebarOpen={isSidebarOpen}
            sidebarWidth={sidebarWidth}
            title="Fortun Cloud"
          />

          <Container
            maxWidth={false}
            sx={{
              mt: `${headerBarHeight + 10}px`,
            }}
          >
            <GlobalQueryLoadingWrapper>
              <Outlet />
            </GlobalQueryLoadingWrapper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
