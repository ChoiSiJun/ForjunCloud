import { Alert, Button, Paper, Stack, TextField } from '@mui/material';
import UserSettingsLayout from '@domain/user/components/UserSettingsLayout';
import usePasswordSettings from '@domain/user/hooks/usePasswordSettings';
import { passwordRequirements } from '@domain/user/user';

const passwordFields = [
  { name: 'currentPassword', label: '현재 비밀번호', autoComplete: 'current-password' },
  { name: 'newPassword', label: '새 비밀번호', autoComplete: 'new-password' },
  { name: 'confirmation', label: '새 비밀번호 확인', autoComplete: 'new-password' },
] as const;

export default function UserPasswordSettings() {
  const { form, feedback, clearFeedback } = usePasswordSettings();
  return (
    <UserSettingsLayout title="비밀번호 변경" detail>
      <Paper component="form" variant="outlined" onSubmit={form.handleSubmit} noValidate sx={{ p: 3 }}>
        <Stack spacing={2}>
          {passwordFields.map(({ name, label, autoComplete }) => (
            <TextField key={name} label={label} type="password" autoComplete={autoComplete} required
              {...form.getFieldProps(name)} disabled={form.isSubmitting}
              error={Boolean(form.touched[name] && form.errors[name])}
              helperText={(form.touched[name] && form.errors[name]) || (name === 'newPassword' ? passwordRequirements : undefined)}
              onChange={event => { form.handleChange(event); clearFeedback(); }} />
          ))}
          {feedback && <Alert severity={feedback.error ? 'error' : 'success'}>{feedback.text}</Alert>}
          <Button type="submit" variant="contained" disabled={form.isSubmitting} sx={{ alignSelf: 'flex-start' }}>
            {form.isSubmitting ? '변경하는 중' : '비밀번호 변경'}
          </Button>
        </Stack>
      </Paper>
    </UserSettingsLayout>
  );
}
