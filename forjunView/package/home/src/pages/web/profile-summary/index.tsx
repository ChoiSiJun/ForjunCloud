import { Alert, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { usePublicProfileSummary } from '@domain/profile-summary/hooks/useProfileSummary';

export default function PublicProfileSummaryPage() {
  const { userId = '' } = useParams();
  const { data, isLoading, isError } = usePublicProfileSummary(userId);
  return (
    <Stack spacing={3} sx={{ maxWidth: 880, mx: 'auto', p: { xs: 2, sm: 4 }, overflowWrap: 'anywhere' }}>
      <Typography component="h1" variant="h4" fontWeight={700}>프로필 요약</Typography>
      {isLoading && <CircularProgress aria-label="프로필 요약 불러오는 중" />}
      {isError && <Alert severity="error">프로필 요약을 불러오지 못했습니다.</Alert>}
      {!isLoading && !isError && !data && <Typography color="text.secondary">공개된 프로필 요약이 없습니다.</Typography>}
      {data && !isError && (
        <>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700}>{data.headline}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography component="h2" variant="h6">핵심 강점</Typography>
              {data.strengths.map((strength, index) => (
                <Box key={`${strength.title}-${index}`}>
                  <Typography component="h3" fontWeight={700}>{strength.title}</Typography>
                  <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{strength.evidence}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography component="h2" variant="h6" gutterBottom>일하는 방식</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{data.workingStyle}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography component="h2" variant="h6" gutterBottom>대표 경험</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{data.representativeExperience}</Typography>
          </Paper>
        </>
      )}
    </Stack>
  );
}
