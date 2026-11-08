import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // react-router 사용 시

const PrivatePage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/'); // 홈 경로로 이동
  };

  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 3,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        color="text.primary"
      >
        접근 권한이 없습니다.
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        이 페이지는 비공개 페이지입니다. 로그인이 필요하거나 권한이 부족합니다.
      </Typography>

      <Button variant="contained" color="primary" onClick={goHome}>
        메인으로 이동
      </Button>
    </Box>
  );
};

export default PrivatePage;
