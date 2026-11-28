import { Alert, Button, CircularProgress, MenuItem, Paper, Stack, TextField } from '@mui/material';
import UserSettingsLayout from '@domain/user/components/UserSettingsLayout';
import { usePrivacySettings } from '@domain/user/hooks/useUser';

const visibilityOptions = [
  { value: 'PUBLIC', label: '공개' },
  { value: 'PRIVATE', label: '비공개' },
];

export default function UserPrivacySettings() {
  const { user, form } = usePrivacySettings();
  return (
    <UserSettingsLayout title="권한 설정" detail>
      {user.isLoading && <CircularProgress aria-label="권한 설정 불러오는 중" />}
      {user.isError && (
        <Alert severity="error" action={<Button onClick={() => user.refetch()}>다시 시도</Button>}>
          권한 설정을 불러오지 못했습니다.
        </Alert>
      )}
      {user.data && !user.isError && (
        <Paper component="form" variant="outlined" onSubmit={form.handleSubmit} sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField id="history-visibility" select label="히스토리 공개 설정" {...form.getFieldProps('historyPrivate')} disabled={form.isSubmitting}>
              {visibilityOptions.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
            </TextField>
            <TextField id="personal-visibility" select label="자기소개서 공개 설정" {...form.getFieldProps('personalPrivate')} disabled={form.isSubmitting}>
              {visibilityOptions.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
            </TextField>
            <Button type="submit" variant="contained" disabled={form.isSubmitting || !form.dirty} sx={{ alignSelf: 'flex-start' }}>
              {form.isSubmitting ? '저장하는 중' : '권한 설정 저장'}
            </Button>
          </Stack>
        </Paper>
      )}
    </UserSettingsLayout>
  );
}
