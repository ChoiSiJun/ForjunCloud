// WebContainer.tsx
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { appTheme } from '@ui-kit/app/themes/appTheme';

export default function WebContainer() {
  const { userId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'SI' | 'SM' | 'RND' | 'TOY'>('PERSONAL');
  const navigate = useNavigate();

  // 현재 경로가 /forjun/web으로 시작하는지 확인
  const basePath = location.pathname.startsWith('/forjun/web') ? '/forjun/web' : '/web';

  useEffect(() => {
    if (location.pathname.includes('/personal')) {
      setActiveTab('PERSONAL');
    } else if (location.pathname.includes('/history/si')) {
      setActiveTab('SI');
    } else if (location.pathname.includes('/history/sm')) {
      setActiveTab('SM');
    } else if (location.pathname.includes('/history/rnd')) {
      setActiveTab('RND');
    } else if (location.pathname.includes('/history/toy')) {
      setActiveTab('TOY');
    }
  }, [location.pathname]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#f7f8fa',
        }}
      >
        {/* 상단 메뉴 */}
        <Box
          sx={{
            height: 64,
            px: 4,
            bgcolor: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              position: 'relative',
              bgcolor: 'rgba(0,0,0,0.02)',
              borderRadius: 3,
              p: 0.5,
              display: 'inline-flex',
            }}
          >
            <Button
              onClick={() => {
                setActiveTab('PERSONAL');
                navigate(`${basePath}/${userId}/profile/personal`);
              }}
              sx={{
                color: activeTab === 'PERSONAL' ? '#5a67d8' : '#6b7280',
                fontWeight: activeTab === 'PERSONAL' ? 600 : 500,
                px: 3,
                py: 1,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                backgroundColor: activeTab === 'PERSONAL' ? 'rgba(102, 126, 234, 0.12)' : 'transparent',
                boxShadow: activeTab === 'PERSONAL' ? '0 2px 8px rgba(102, 126, 234, 0.15)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.12)',
                  color: '#5a67d8',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              Profile
            </Button>
            <Button
              onClick={() => {
                setActiveTab('SI');
                navigate(`${basePath}/${userId}/profile/history/si`);
              }}
              sx={{
                color: activeTab === 'SI' ? '#5a67d8' : '#6b7280',
                fontWeight: activeTab === 'SI' ? 600 : 500,
                px: 3,
                py: 1,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                backgroundColor: activeTab === 'SI' ? 'rgba(102, 126, 234, 0.12)' : 'transparent',
                boxShadow: activeTab === 'SI' ? '0 2px 8px rgba(102, 126, 234, 0.15)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.12)',
                  color: '#5a67d8',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              SI History
            </Button>

            <Button
              onClick={() => {
                setActiveTab('SM');
                navigate(`${basePath}/${userId}/profile/history/sm`);
              }}
              sx={{
                color: activeTab === 'SM' ? '#5a67d8' : '#6b7280',
                fontWeight: activeTab === 'SM' ? 600 : 500,
                px: 3,
                py: 1,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                backgroundColor: activeTab === 'SM' ? 'rgba(102, 126, 234, 0.12)' : 'transparent',
                boxShadow: activeTab === 'SM' ? '0 2px 8px rgba(102, 126, 234, 0.15)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.12)',
                  color: '#5a67d8',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              SM History
            </Button>

            <Button
              onClick={() => {
                setActiveTab('RND');
                navigate(`${basePath}/${userId}/profile/history/rnd`);
              }}
              sx={{
                color: activeTab === 'RND' ? '#5a67d8' : '#6b7280',
                fontWeight: activeTab === 'RND' ? 600 : 500,
                px: 3,
                py: 1,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                backgroundColor: activeTab === 'RND' ? 'rgba(102, 126, 234, 0.12)' : 'transparent',
                boxShadow: activeTab === 'RND' ? '0 2px 8px rgba(102, 126, 234, 0.15)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.12)',
                  color: '#5a67d8',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              RND History
            </Button>

            <Button
              onClick={() => {
                setActiveTab('TOY');
                navigate(`${basePath}/${userId}/profile/history/toy`);
              }}
              sx={{
                color: activeTab === 'TOY' ? '#5a67d8' : '#6b7280',
                fontWeight: activeTab === 'TOY' ? 600 : 500,
                px: 3,
                py: 1,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                backgroundColor: activeTab === 'TOY' ? 'rgba(102, 126, 234, 0.12)' : 'transparent',
                boxShadow: activeTab === 'TOY' ? '0 2px 8px rgba(102, 126, 234, 0.15)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.12)',
                  color: '#5a67d8',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              Toy History
            </Button>
          </Stack>
        </Box>

        {/* 내용 영역 */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
