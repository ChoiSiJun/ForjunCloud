import { PropsWithChildren } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  detail?: boolean;
}

export default function UserSettingsLayout({ title, detail, children }: PropsWithChildren<Props>) {
  return (
    <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: 'auto' }}>
      {detail && (
        <Button component={Link} to="/forjun/user/settings" startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start' }}>
          개인정보 설정으로 돌아가기
        </Button>
      )}
      <Typography component="h2" variant="h4" fontWeight={700}>{title}</Typography>
      {children}
    </Stack>
  );
}
