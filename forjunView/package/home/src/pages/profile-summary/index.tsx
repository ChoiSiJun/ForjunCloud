import { useRef, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { AiGeneration, emptySummary, ProfileSummary, ProfileSummaryDraft, readSummaryDraft } from '@domain/profile-summary/ProfileSummary';
import { useProfileSummary } from '@domain/profile-summary/hooks/useProfileSummary';

const strengthKeys = ['first', 'second', 'third'];
const maxPromptLength = 100000;
type AiAction = 'manual' | 'direct';
type Feedback = { error: boolean; text: string };
type DraftCandidate = { draft: ProfileSummaryDraft; extras?: Pick<AiGeneration, 'resumeSummary' | 'swot'> };
const swotSections = [
  { key: 'strengths', label: '강점' },
  { key: 'weaknesses', label: '약점' },
  { key: 'opportunities', label: '기회' },
  { key: 'threats', label: '위협' },
] as const;

export default function ProfileSummaryPage() {
  const { userId, summary, save, prompt, aiSettings, generate } = useProfileSummary();
  const [edited, setEdited] = useState<ProfileSummary>();
  const [editing, setEditing] = useState(false);
  const [previewDraft, setPreviewDraft] = useState<ProfileSummary>();
  const [extras, setExtras] = useState<DraftCandidate['extras']>();
  const [resumeEdit, setResumeEdit] = useState<string>();
  const [manualPrompt, setManualPrompt] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [confirmation, setConfirmation] = useState<DraftCandidate | 'discard'>();
  const [manualReplacement, setManualReplacement] = useState<ProfileSummaryDraft>();
  const [answerError, setAnswerError] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<Feedback>();
  const [promptCopyFeedback, setPromptCopyFeedback] = useState<Feedback>();
  const [copyFeedback, setCopyFeedback] = useState<Feedback>();
  const [feedback, setFeedback] = useState<Feedback>();
  const [action, setAction] = useState<AiAction>();
  const actionLock = useRef(false);
  const draft = edited ?? previewDraft ?? summary.data ?? emptySummary;
  const resumeSummary = resumeEdit ?? extras?.resumeSummary;
  const hasEdits = Boolean(edited) || resumeEdit !== undefined;
  const isUnsaved = hasEdits || Boolean(previewDraft);
  const hasPreview = Boolean(draft.headline || draft.workingStyle || draft.representativeExperience || draft.strengths.length || resumeSummary);
  const update = (change: Partial<ProfileSummary>) => setEdited({ ...draft, ...change });
  const busy = save.isLoading || Boolean(action);
  const destination = aiSettings.data?.hasApiKey && !aiSettings.isError ? aiSettings.data.baseUrl : undefined;

  const copyText = async (value: string, label: string, showFeedback: (feedback: Feedback) => void) => {
    try {
      await navigator.clipboard.writeText(value);
      showFeedback({ error: false, text: `${label}을 복사했습니다.` });
    } catch {
      showFeedback({ error: true, text: '자동 복사를 할 수 없습니다. 화면에서 직접 복사해 주세요.' });
    }
  };

  const resetEdits = () => {
    setEdited(undefined);
    setResumeEdit(undefined);
    setFeedback(undefined);
  };

  const loadDraft = (candidate: DraftCandidate) => {
    setPreviewDraft({ ...candidate.draft, published: summary.data?.published ?? false });
    setExtras(candidate.extras);
    resetEdits();
    setEditing(false);
    setCopyFeedback(undefined);
    setConfirmation(undefined);
  };

  const generateDraft = async (baseUrl: string, sourcePrompt: string, role: string) => {
    if (sourcePrompt.length > maxPromptLength) {
      setAiFeedback({ error: true, text: '자료가 너무 길어 바로 요약할 수 없습니다. 프롬프트를 생성해 필요한 부분만 골라 복사해 주세요.' });
      return;
    }
    try {
      const generated = await generate.mutateAsync({ baseUrl, prompt: sourcePrompt, ...(role && { targetRole: role }) });
      const candidate = { draft: readSummaryDraft(generated), extras: { resumeSummary: generated.resumeSummary, swot: generated.swot } };
      if (isUnsaved) setConfirmation(candidate);
      else loadDraft(candidate);
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      if (status === 409) aiSettings.refetch();
      let text = 'AI 초안을 만들지 못했습니다. AI 연결 설정을 확인하거나 다시 시도해 주세요.';
      if (status === 409) text = 'AI 연결 설정이 바뀌었거나 삭제되었습니다. 현재 전송 주소를 확인한 뒤 다시 생성해 주세요.';
      if (status === 400) text = '프롬프트와 목표 직무를 확인해 주세요.';
      setAiFeedback({ error: true, text });
    }
  };

  const startAiAction = async (mode: AiAction) => {
    if (busy || actionLock.current || (mode === 'direct' && (!destination || aiSettings.isFetching))) return;
    actionLock.current = true;
    setAction(mode);
    setAiFeedback(undefined);
    const role = targetRole.trim();
    try {
      const sourcePrompt = await prompt.mutateAsync();
      if (!sourcePrompt?.trim()) {
        setAiFeedback({ error: true, text: '먼저 자기소개나 경력을 작성해 주세요.' });
      } else if (mode === 'manual') {
        setPromptCopyFeedback(undefined);
        setAnswerError(false);
        setManualPrompt(sourcePrompt);
      } else if (destination) {
        await generateDraft(destination, sourcePrompt, role);
      }
    } catch {
      setAiFeedback({ error: true, text: '자기소개서와 전체 경력을 불러오지 못했습니다. 다시 시도해 주세요.' });
    } finally {
      actionLock.current = false;
      setAction(undefined);
    }
  };

  const copyResume = () => {
    const strengths = draft.strengths.map(({ title, evidence }) => [title, evidence].filter(Boolean).join(' — ')).filter(Boolean);
    const lines = [draft.headline, resumeSummary?.trim(), draft.workingStyle, draft.representativeExperience, ...strengths];
    copyText(lines.filter(Boolean).join('\n\n'), '자기 PR', setCopyFeedback);
  };

  const closePrompt = () => {
    setManualPrompt(null);
    setManualReplacement(undefined);
    setAnswerError(false);
  };

  const importAnswer = (next: ProfileSummaryDraft) => {
    loadDraft({ draft: next });
    setAnswer('');
    closePrompt();
  };

  const applyAnswer = () => {
    try {
      const json = answer.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      const next = readSummaryDraft(JSON.parse(json));
      setAnswerError(false);
      if (isUnsaved) setManualReplacement(next);
      else importAnswer(next);
    } catch {
      setAnswerError(true);
    }
  };

  const saveSummary = async () => {
    if (busy || actionLock.current) return;
    let normalized;
    try {
      normalized = { ...readSummaryDraft(draft), published: draft.published };
    } catch {
      setFeedback({ error: true, text: '모든 요약 항목과 강점 근거를 입력하고 글자 수를 확인해 주세요.' });
      return;
    }
    try {
      await save.mutateAsync(normalized);
      setPreviewDraft(undefined);
      if (extras && resumeEdit !== undefined) setExtras({ ...extras, resumeSummary: resumeEdit });
      resetEdits();
      setEditing(false);
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
          <Typography component="h3" variant="h6">AI 초안 만들기</Typography>
          {aiSettings.isLoading && <CircularProgress size={24} aria-label="AI 연결 설정 불러오는 중" />}
          {aiSettings.isError && <Alert severity="error" action={<Button onClick={() => aiSettings.refetch()}>다시 시도</Button>}>AI 연결 설정을 불러오지 못했습니다.</Alert>}
          {aiSettings.data && !aiSettings.data.hasApiKey && (
            <Button component={Link} to="/forjun/user/settings/ai">AI 연결 설정 열기</Button>
          )}
          {destination && (
            <>
              <TextField label="목표 직무 (선택)" value={targetRole} inputProps={{ maxLength: 200 }} disabled={busy}
                onChange={event => setTargetRole(event.target.value)} />
              <Typography id="ai-direct-destination" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                바로 요약하면 자기소개와 전체 경력, 입력한 목표 직무를 <strong>{destination}</strong>에 보냅니다.
              </Typography>
            </>
          )}
          <Stack direction="row" alignItems="center" justifyContent="space-between" useFlexGap flexWrap="wrap" gap={1}>
            <Button variant="contained" onClick={() => startAiAction('direct')} disabled={busy || !destination || aiSettings.isFetching}
              aria-describedby={destination ? 'ai-direct-destination' : undefined}>
              {action === 'direct' ? 'AI로 요약하는 중' : 'AI로 바로 요약'}
            </Button>
            <Button size="small" variant="text" onClick={() => startAiAction('manual')} disabled={busy} sx={{ ml: 'auto', textDecoration: 'underline' }}>
              {action === 'manual' ? '프롬프트 만드는 중' : '프롬프트 생성하기'}
            </Button>
          </Stack>
          {aiFeedback && <Alert severity={aiFeedback.error ? 'error' : 'success'}>{aiFeedback.text}</Alert>}
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, overflowWrap: 'anywhere' }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" useFlexGap flexWrap="wrap" gap={1}>
            <Typography component="h3" variant="h6">자기 PR</Typography>
            <Button onClick={() => setEditing(!editing)} disabled={busy}>{editing ? '미리보기' : '편집하기'}</Button>
          </Stack>
          {isUnsaved && <Typography role="status" color="text.secondary" variant="body2">저장하지 않은 초안</Typography>}
          {!editing && (hasPreview ? (
            <Stack spacing={2} sx={{ whiteSpace: 'pre-wrap' }}>
              {draft.headline && <Typography component="h4" variant="h5" fontWeight={700}>{draft.headline}</Typography>}
              {resumeSummary && <Typography>{resumeSummary}</Typography>}
              {draft.workingStyle && <Typography>{draft.workingStyle}</Typography>}
              {draft.representativeExperience && <Typography>{draft.representativeExperience}</Typography>}
              {draft.strengths.map(({ title, evidence }, index) => (
                <Typography key={strengthKeys[index]}>
                  {title && <Box component="strong">{title}</Box>}{title && evidence && ' — '}{evidence}
                </Typography>
              ))}
            </Stack>
          ) : <Typography color="text.secondary">AI로 초안을 만들거나 직접 작성해 보세요.</Typography>)}
          {editing && (
            <Stack spacing={2}>
              <TextField label="한 줄 소개" value={draft.headline} inputProps={{ maxLength: 200 }} disabled={busy} onChange={event => update({ headline: event.target.value })} />
              {draft.strengths.map((strength, index) => (
                <Stack spacing={1} key={strengthKeys[index]}>
                  <TextField label={`강점 ${index + 1}`} value={strength.title} inputProps={{ maxLength: 100 }} disabled={busy} onChange={event => update({ strengths: draft.strengths.map((item, i) => i === index ? { ...item, title: event.target.value } : item) })} />
                  <TextField label={`강점 ${index + 1}의 근거`} multiline value={strength.evidence} inputProps={{ maxLength: 600 }} disabled={busy} onChange={event => update({ strengths: draft.strengths.map((item, i) => i === index ? { ...item, evidence: event.target.value } : item) })} />
                  <Button onClick={() => update({ strengths: draft.strengths.filter((_, i) => i !== index) })} disabled={busy}>강점 삭제</Button>
                </Stack>
              ))}
              <Button onClick={() => update({ strengths: [...draft.strengths, { title: '', evidence: '' }] })} disabled={draft.strengths.length >= 3 || busy}>강점 추가</Button>
              <TextField label="일하는 방식" multiline minRows={3} value={draft.workingStyle} inputProps={{ maxLength: 2000 }} disabled={busy} onChange={event => update({ workingStyle: event.target.value })} />
              <TextField label="대표 경험" multiline minRows={3} value={draft.representativeExperience} inputProps={{ maxLength: 2000 }} disabled={busy} onChange={event => update({ representativeExperience: event.target.value })} />
              {extras && <TextField label="이력서 요약" multiline minRows={3} value={resumeSummary ?? ''} helperText="이력서 요약 편집은 현재 화면에서만 유지됩니다." disabled={busy} onChange={event => setResumeEdit(event.target.value)} />}
              <FormControlLabel control={<Checkbox checked={draft.published} disabled={busy} onChange={event => update({ published: event.target.checked })} />} label="저장한 요약을 공개 프로필에 표시" />
            </Stack>
          )}
          {(editing || hasPreview || isUnsaved) && (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {editing && <Button variant="contained" onClick={saveSummary} disabled={busy}>{draft.published ? '저장 및 공개' : '비공개 저장'}</Button>}
              {!editing && hasPreview && <Button onClick={copyResume} disabled={busy}>자기 PR 복사</Button>}
              {isUnsaved && <Button onClick={() => setConfirmation('discard')} disabled={busy}>{hasEdits ? '편집 내용 되돌리기' : '초안 버리기'}</Button>}
            </Stack>
          )}
          {!editing && copyFeedback && <Alert severity={copyFeedback.error ? 'error' : 'success'}>{copyFeedback.text}</Alert>}
          {feedback && <Alert severity={feedback.error ? 'error' : 'success'}>{feedback.text}</Alert>}
          {extras && !editing && (
            <Accordion disableGutters elevation={0} sx={{ '&::before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} id="summary-swot-header" aria-controls="summary-swot-body" sx={{ px: 0 }}>
                <Typography>비공개 SWOT 분석</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                <Stack spacing={2}>
                  {swotSections.map(({ key, label }) => (
                    <Box key={key}>
                      <Typography fontWeight={700}>{label}</Typography>
                      {extras.swot[key].length > 0 ? (
                        <Box component="ul" sx={{ my: 0, pl: 3 }}>
                          {extras.swot[key].map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
                        </Box>
                      ) : <Typography color="text.secondary">기록된 항목이 없습니다.</Typography>}
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}
          {summary.data?.published && <Button component={Link} to={`/web/${encodeURIComponent(userId)}/profile/summary`}>공개 요약 보기</Button>}
        </Stack>
      </Paper>
      <Dialog open={manualPrompt !== null} onClose={closePrompt} fullWidth maxWidth="md" aria-labelledby="summary-prompt-title">
        <DialogTitle id="summary-prompt-title">프롬프트</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="생성한 프롬프트" value={manualPrompt ?? ''} onChange={event => {
              setManualPrompt(event.target.value);
              setPromptCopyFeedback(undefined);
            }} multiline minRows={4} maxRows={9} fullWidth />
            <Button variant="outlined" disabled={!manualPrompt?.trim()} sx={{ alignSelf: 'flex-start' }}
              onClick={() => copyText(manualPrompt ?? '', '프롬프트', setPromptCopyFeedback)}>프롬프트 복사</Button>
            {promptCopyFeedback && <Alert severity={promptCopyFeedback.error ? 'error' : 'success'}>{promptCopyFeedback.text}</Alert>}
            <TextField label="AI 답변 붙여넣기" value={answer} onChange={event => {
              setAnswer(event.target.value);
              setAnswerError(false);
              setManualReplacement(undefined);
            }} multiline minRows={3} maxRows={8} fullWidth error={answerError}
              helperText={answerError ? '응답 형식이 맞지 않습니다. AI 답변의 JSON 전체를 붙여넣어 주세요.' : '외부 AI가 반환한 JSON 전체를 붙여넣으세요.'} />
            {manualReplacement && <Alert severity="warning">저장하지 않은 초안을 이 답변으로 바꿀까요?</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          {manualReplacement ? (
            <>
              <Button onClick={() => setManualReplacement(undefined)}>취소</Button>
              <Button variant="contained" onClick={() => importAnswer(manualReplacement)}>초안으로 바꾸기</Button>
            </>
          ) : (
            <>
              <Button onClick={closePrompt}>닫기</Button>
              <Button variant="contained" onClick={applyAnswer} disabled={!answer.trim() || busy}>답변 적용</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(confirmation)} onClose={() => setConfirmation(undefined)} aria-labelledby="summary-replacement-title">
        <DialogTitle id="summary-replacement-title">{confirmation === 'discard' ? '저장하지 않은 내용을 되돌릴까요?' : '저장하지 않은 내용을 AI 초안으로 바꿀까요?'}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmation(undefined)}>취소</Button>
          <Button onClick={() => {
            if (confirmation === 'discard') {
              if (!hasEdits) {
                setPreviewDraft(undefined);
                setExtras(undefined);
              }
              resetEdits();
              setCopyFeedback(undefined);
              setConfirmation(undefined);
            } else if (confirmation) loadDraft(confirmation);
          }} disabled={busy}>{confirmation === 'discard' ? '되돌리기' : '초안으로 바꾸기'}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
