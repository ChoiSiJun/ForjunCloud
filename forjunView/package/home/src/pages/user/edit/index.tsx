import { Alert, Button, CircularProgress, Paper, Stack, TextField } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import UserSettingsLayout from '@domain/user/components/UserSettingsLayout';
import useUser from '@domain/user/hooks/useUser';

function EditProfile() {
  const { user, form } = useUser();
  return (
    <UserSettingsLayout title="개인정보 수정" detail>
      {user.isLoading && <CircularProgress aria-label="개인정보 불러오는 중" />}
      {user.isError && (
        <Alert severity="error" action={<Button onClick={() => user.refetch()}>다시 시도</Button>}>
          개인정보를 불러오지 못했습니다.
        </Alert>
      )}
      {user.data && !user.isError && (
        <Paper component="form" variant="outlined" onSubmit={form.handleSubmit} noValidate sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField label="이름" autoComplete="name" required {...form.getFieldProps('userName')} disabled={form.isSubmitting}
              error={Boolean(form.touched.userName && form.errors.userName)} helperText={form.touched.userName && form.errors.userName} />
            <TextField label="이메일" type="email" autoComplete="email" required {...form.getFieldProps('email')} disabled={form.isSubmitting}
              error={Boolean(form.touched.email && form.errors.email)} helperText={form.touched.email && form.errors.email} />
            <Button type="submit" variant="contained" disabled={form.isSubmitting || !form.dirty} sx={{ alignSelf: 'flex-start' }}>
              {form.isSubmitting ? '저장하는 중' : '수정하기'}
            </Button>
          </Stack>
        </Paper>
      )}
    </UserSettingsLayout>
  );
}

export default function UserEdit() {
  const { hash } = useLocation();
  return hash === '#ai-settings' ? <Navigate to="/forjun/user/settings/ai" replace /> : <EditProfile />;
}
