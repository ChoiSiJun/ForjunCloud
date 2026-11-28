import { Box, Card, CardActionArea, CardContent, Grid, Stack, Typography } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link } from 'react-router-dom';
import UserSettingsLayout from '@domain/user/components/UserSettingsLayout';

const settings = [
  { title: '개인정보 수정', to: '/forjun/user/edit', icon: EditOutlinedIcon },
  { title: '비밀번호 변경', to: '/forjun/user/settings/password', icon: LockOutlinedIcon },
  { title: 'AI 설정', to: '/forjun/user/settings/ai', icon: AutoAwesomeOutlinedIcon },
  { title: '권한 설정', to: '/forjun/user/settings/privacy', icon: VisibilityOutlinedIcon },
];

export default function UserSettings() {
  return (
    <UserSettingsLayout title="개인정보 설정">
      <Grid container spacing={2}>
        {settings.map(({ title, to, icon: Icon }) => (
          <Grid item xs={12} sm={6} key={to}>
            <Card variant="outlined">
              <CardActionArea component={Link} to={to}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ display: 'flex', color: 'primary.main' }}><Icon /></Box>
                    <Typography component="span" fontWeight={700} sx={{ flexGrow: 1 }}>{title}</Typography>
                    <ChevronRightIcon color="action" />
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </UserSettingsLayout>
  );
}
