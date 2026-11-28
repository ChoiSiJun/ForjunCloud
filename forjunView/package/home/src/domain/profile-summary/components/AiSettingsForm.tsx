import { FormEvent, useState } from 'react';
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { isAxiosError } from 'axios';
import { AiSettingsErrorCode, SaveAiSettingsError } from '../api/useAiSummaryQueries';
import { useAiSettings } from '../hooks/useAiSettings';

const providers = [
  { id: 'openai', label: 'OpenAI', baseUrl: 'https://api.openai.com/v1', modelHint: 'OpenAI 모델 ID' },
  { id: 'gemini', label: 'Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', modelHint: 'gemini-3.1-flash-lite' },
  { id: 'custom', label: '직접 입력', baseUrl: '', modelHint: '사용할 모델 ID' },
] as const;

type Provider = typeof providers[number];
type Field = 'url' | 'model' | 'key';

const validationFeedback: Record<AiSettingsErrorCode, { field?: Field; text: string }> = {
  PROFILE_AI_SETTINGS_BODY_INVALID: { text: '저장 요청을 처리할 수 없습니다. 페이지를 새로고침하고 다시 시도해 주세요.' },
  PROFILE_AI_SETTINGS_URL_INVALID: { field: 'url', text: '지원되는 HTTPS 기본 URL인지 확인해 주세요.' },
  PROFILE_AI_SETTINGS_MODEL_INVALID: { field: 'model', text: '모델 ID는 제어 문자 없이 200자 이내로 입력해 주세요.' },
  PROFILE_AI_SETTINGS_KEY_REQUIRED: { field: 'key', text: '이 URL에 사용할 API 키를 입력해 주세요.' },
  PROFILE_AI_SETTINGS_KEY_INVALID: { field: 'key', text: 'API 키는 공백 없이 출력 가능한 영문 기호·문자·숫자로 최대 2,048자까지 입력할 수 있습니다.' },
};

function isValidBaseUrl(value: string) {
  if (value.length > 512 || !/^https:\/\//i.test(value) || /[\s?#\\]/.test(value)) return false;
  try {
    const parsed = new URL(value);
    return Boolean(parsed.hostname) && !parsed.username && !parsed.password && !parsed.port;
  } catch {
    return false;
  }
}

export default function AiSettingsForm() {
  const { settings, save, remove, test } = useAiSettings();
  const [fields, setFields] = useState<{ provider: Provider; baseUrl: string; model: string }>();
  const [apiKey, setApiKey] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [feedback, setFeedback] = useState<{ error: boolean; text: string; field?: Field }>();
  const saved = settings.data;
  const savedProvider = providers.find(option => option.baseUrl === saved?.baseUrl) ?? providers[2];
  const provider = fields?.provider ?? (saved?.baseUrl ? savedProvider : providers[0]);
  const baseUrl = fields?.baseUrl ?? (saved?.baseUrl || provider.baseUrl);
  const model = fields?.model ?? saved?.model ?? '';
  const url = baseUrl.trim();
  const modelId = model.trim();
  const key = apiKey.trim();
  const requiresKey = !saved?.hasApiKey || url !== saved.baseUrl;
  const busy = settings.isFetching || save.isLoading || remove.isLoading || test.isLoading;
  const dirty = url !== saved?.baseUrl || modelId !== saved?.model || Boolean(key);
  const urlError = Boolean(url) && !isValidBaseUrl(url);
  const modelError = modelId.length > 200 || [...modelId].some(character => {
    const code = character.charCodeAt(0);
    return code <= 31 || (code >= 127 && code <= 159);
  });
  const keyError = Boolean(key) && !/^[!-~]{1,2048}$/.test(key);
  const keyHint = requiresKey ? validationFeedback.PROFILE_AI_SETTINGS_KEY_REQUIRED.text
    : 'API 키가 저장되어 있습니다. 교체하려면 새 키를 입력해 주세요.';
  const canSave = !busy && dirty && Boolean(url) && !urlError && Boolean(modelId) && !modelError
    && (!requiresKey || Boolean(key)) && !keyError;

  const selectProvider = (id: string) => {
    const next = providers.find(option => option.id === id);
    if (!next || next.id === provider.id) return;
    const restoreSaved = Boolean(saved?.baseUrl) && next.id === savedProvider.id;
    setFields({ provider: next, baseUrl: (restoreSaved && saved?.baseUrl) || next.baseUrl, model: (restoreSaved && saved?.model) || '' });
    setApiKey('');
    setFeedback(undefined);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
    setFeedback(undefined);
    try {
      await save.mutateAsync({ baseUrl: url, model: modelId, ...(key && { apiKey: key }) });
      setFields(undefined);
      setApiKey('');
      setFeedback({ error: false, text: 'AI 연결 설정을 저장했습니다.' });
    } catch (error) {
      if (error instanceof SaveAiSettingsError && error.code) {
        setFeedback({ error: true, ...validationFeedback[error.code] });
      } else {
        setFeedback({ error: true, text: error instanceof SaveAiSettingsError && error.invalidRequest
          ? '기본 URL, 모델 이름, API 키를 확인해 주세요.' : 'AI 연결 설정을 저장하지 못했습니다.' });
      }
    }
  };

  const removeSettings = async () => {
    if (busy) return;
    setConfirmDelete(false);
    setFeedback(undefined);
    try {
      await remove.mutateAsync();
      setFields(undefined);
      setApiKey('');
      setFeedback({ error: false, text: 'AI 연결 설정을 삭제했습니다.' });
    } catch {
      setFeedback({ error: true, text: 'AI 연결 설정을 삭제하지 못했습니다.' });
    }
  };

  const testSettings = async () => {
    if (busy || dirty) return;
    setFeedback(undefined);
    try {
      await test.mutateAsync();
      setFeedback({ error: false, text: '저장된 설정으로 AI 연결에 성공했습니다.' });
    } catch (error) {
      setFeedback({ error: true, text: isAxiosError(error) && error.response?.status === 409
        ? 'AI 연결 설정을 다시 저장해 주세요.' : 'AI 연결에 실패했습니다. URL, 모델 이름, API 키를 확인해 주세요.' });
    }
  };

  return (
    <Paper component="form" id="ai-settings" variant="outlined" onSubmit={submit} sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2}>
        <Typography component="h2" variant="h6">AI 연결 설정</Typography>
        {settings.isLoading && <CircularProgress size={24} aria-label="AI 연결 설정 불러오는 중" />}
        {settings.isError && (
          <Alert severity="error" action={<Button onClick={() => settings.refetch()}>다시 시도</Button>}>
            AI 연결 설정을 불러오지 못했습니다.
          </Alert>
        )}
        {saved && !settings.isError && (
          <>
            <TextField id="ai-provider" select label="AI 제공업체" value={provider.id} disabled={busy} onChange={event => selectProvider(event.target.value)}>
              {providers.map(option => <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>)}
            </TextField>
            <TextField label="OpenAI 호환 기본 URL" type="url" required value={baseUrl} disabled={busy} InputProps={{ readOnly: provider.id !== 'custom' }}
              error={urlError || feedback?.field === 'url'} helperText={urlError && '쿼리, 인증 정보, 별도 포트가 없는 HTTPS URL을 512자 이내로 입력해 주세요.'}
              onChange={event => {
                const nextUrl = event.target.value;
                if (nextUrl.trim() !== url) setApiKey('');
                setFields({ provider, baseUrl: nextUrl, model });
                setFeedback(undefined);
              }} />
            <TextField label="모델 이름" required value={model} disabled={busy} inputProps={{ maxLength: 200 }}
              error={modelError || feedback?.field === 'model'} helperText={modelError && validationFeedback.PROFILE_AI_SETTINGS_MODEL_INVALID.text}
              placeholder={provider.modelHint} onChange={event => {
                setFields({ provider, baseUrl, model: event.target.value });
                setFeedback(undefined);
              }} />
            <TextField label="API 키" type="password" autoComplete="new-password" required={requiresKey} value={apiKey} inputProps={{ maxLength: 2048 }}
              disabled={busy} error={keyError || feedback?.field === 'key'}
              onChange={event => {
                setApiKey(event.target.value);
                setFeedback(undefined);
              }}
              helperText={keyError ? validationFeedback.PROFILE_AI_SETTINGS_KEY_INVALID.text : keyHint} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button type="submit" variant="contained" disabled={!canSave}>
                {save.isLoading ? '저장하는 중' : 'AI 설정 저장'}
              </Button>
              <Button variant="outlined" onClick={testSettings} disabled={busy || dirty || !saved.hasApiKey}>
                {test.isLoading ? '연결 확인 중' : '저장된 설정으로 연결 테스트'}
              </Button>
              <Button color="error" onClick={() => setConfirmDelete(true)} disabled={busy || !saved.baseUrl}>
                {remove.isLoading ? '삭제하는 중' : 'AI 설정 삭제'}
              </Button>
            </Stack>
          </>
        )}
        {feedback && <Alert severity={feedback.error ? 'error' : 'success'}>{feedback.text}</Alert>}
      </Stack>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} aria-labelledby="ai-settings-delete-title">
        <DialogTitle id="ai-settings-delete-title">저장된 AI 연결 설정을 삭제할까요?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>취소</Button>
          <Button color="error" onClick={removeSettings} disabled={busy}>설정 삭제</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
