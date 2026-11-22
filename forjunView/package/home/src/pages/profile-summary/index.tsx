import { useState } from 'react';
import { Alert, Button, Checkbox, CircularProgress, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { emptySummary, ProfileSummary, readSummaryDraft } from '@domain/profile-summary/ProfileSummary';
import { useProfileSummary } from '@domain/profile-summary/hooks/useProfileSummary';

const strengthKeys = ['first', 'second', 'third'];

export default function ProfileSummaryPage() {
  const { userId, summary, save, prompt } = useProfileSummary();
  const [edited, setEdited] = useState<ProfileSummary>();
  const [promptText, setPromptText] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ error: boolean; text: string }>();
  const draft = edited ?? summary.data ?? emptySummary;
  const update = (change: Partial<ProfileSummary>) => setEdited({ ...draft, ...change });

  const generatePrompt = async () => {
    setFeedback(undefined);
    try {
      const generated = await prompt.mutateAsync();
      if (generated) setPromptText(generated);
      else setFeedback({ error: true, text: '먼저 자기소개나 경력을 작성해 주세요.' });
    } catch {
      setFeedback({ error: true, text: '자기소개서와 전체 경력을 불러오지 못했습니다. 다시 시도해 주세요.' });
    }
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setFeedback({ error: false, text: '프롬프트를 복사했습니다.' });
    } catch {
      setFeedback({ error: true, text: '자동 복사를 할 수 없습니다. 프롬프트 입력란에서 직접 복사해 주세요.' });
    }
  };

  const applyAnswer = () => {
    try {
      const json = answer.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      update(readSummaryDraft(JSON.parse(json)));
      setFeedback({ error: false, text: '초안을 가져왔습니다. 내용과 공개 여부를 확인해 주세요.' });
    } catch {
      setFeedback({ error: true, text: '응답 형식이 맞지 않습니다. AI 답변의 JSON 전체를 붙여넣어 주세요.' });
    }
  };

  const saveSummary = async () => {
    let normalized;
    try {
      normalized = { ...readSummaryDraft(draft), published: draft.published };
    } catch {
      setFeedback({ error: true, text: '모든 요약 항목과 강점 근거를 입력하고 글자 수를 확인해 주세요.' });
      return;
    }
    try {
      await save.mutateAsync(normalized);
      setEdited(undefined);
      setFeedback({ error: false, text: normalized.published ? '저장하고 공개했습니다.' : '비공개로 저장했습니다.' });
    } catch {
      setFeedback({ error: true, text: '요약을 저장하지 못했습니다. 다시 시도해 주세요.' });
    }
  };

  if (summary.isLoading) return <CircularProgress aria-label="프로필 요약 불러오는 중" />;
  if (summary.isError) return <Alert severity="error" action={<Button onClick={() => summary.refetch()}>다시 시도</Button>}>요약을 불러오지 못했습니다.</Alert>;

  return (
    <Stack spacing={3} sx={{ maxWidth: 880, mx: 'auto', py: 3 }}>
      <Typography component="h2" variant="h4" fontWeight={700}>프로필 요약</Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Typography component="h3" variant="h6">AI 초안 가져오기</Typography>
          <Typography color="text.secondary">자기소개와 전체 경력으로 프롬프트를 만들고, 외부 AI의 JSON 답변을 붙여넣으세요. 복사하기 전에 외부로 보낼 내용을 확인할 수 있습니다.</Typography>
          <Button variant="outlined" onClick={generatePrompt} disabled={prompt.isLoading}>프롬프트 만들기</Button>
          {promptText && (
            <>
              <TextField label="프롬프트 미리보기" multiline minRows={4} maxRows={12} value={promptText} onChange={event => setPromptText(event.target.value)} />
              <Button onClick={copyPrompt}>프롬프트 복사</Button>
            </>
          )}
          <TextField label="AI 답변 붙여넣기" multiline minRows={3} maxRows={10} value={answer} onChange={event => setAnswer(event.target.value)} />
          <Button onClick={applyAnswer} disabled={!answer.trim() || save.isLoading}>편집기에 가져오기</Button>
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Typography component="h3" variant="h6">요약 편집</Typography>
          <TextField label="한 줄 소개" value={draft.headline} inputProps={{ maxLength: 200 }} disabled={save.isLoading} onChange={event => update({ headline: event.target.value })} />
          {draft.strengths.map((strength, index) => (
            <Stack spacing={1} key={strengthKeys[index]}>
              <TextField label={`강점 ${index + 1}`} value={strength.title} inputProps={{ maxLength: 100 }} disabled={save.isLoading} onChange={event => update({ strengths: draft.strengths.map((item, i) => i === index ? { ...item, title: event.target.value } : item) })} />
              <TextField label={`강점 ${index + 1}의 근거`} multiline value={strength.evidence} inputProps={{ maxLength: 600 }} disabled={save.isLoading} onChange={event => update({ strengths: draft.strengths.map((item, i) => i === index ? { ...item, evidence: event.target.value } : item) })} />
              <Button onClick={() => update({ strengths: draft.strengths.filter((_, i) => i !== index) })} disabled={save.isLoading}>강점 삭제</Button>
            </Stack>
          ))}
          <Button onClick={() => update({ strengths: [...draft.strengths, { title: '', evidence: '' }] })} disabled={draft.strengths.length >= 3 || save.isLoading}>강점 추가</Button>
          <TextField label="일하는 방식" multiline minRows={3} value={draft.workingStyle} inputProps={{ maxLength: 2000 }} disabled={save.isLoading} onChange={event => update({ workingStyle: event.target.value })} />
          <TextField label="대표 경험" multiline minRows={3} value={draft.representativeExperience} inputProps={{ maxLength: 2000 }} disabled={save.isLoading} onChange={event => update({ representativeExperience: event.target.value })} />
          <FormControlLabel control={<Checkbox checked={draft.published} disabled={save.isLoading} onChange={event => update({ published: event.target.checked })} />} label="저장한 요약을 공개 프로필에 표시" />
          {feedback && <Alert severity={feedback.error ? 'error' : 'success'}>{feedback.text}</Alert>}
          <Button variant="contained" onClick={saveSummary} disabled={save.isLoading}>{draft.published ? '저장 및 공개' : '비공개 저장'}</Button>
          {summary.data?.published && <Button component={Link} to={`/web/${encodeURIComponent(userId)}/profile/summary`}>공개 요약 보기</Button>}
        </Stack>
      </Paper>
    </Stack>
  );
}
