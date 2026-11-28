import { Box, Paper, Stack, Typography } from '@mui/material';
import { ProfileSummary } from '@domain/profile-summary/ProfileSummary';

export default function PublicProfileSummary({ data }: { data: ProfileSummary }) {
  return (
    <Paper component="section" variant="outlined" aria-labelledby="public-profile-summary-title" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, overflowWrap: 'anywhere' }}>
      <Stack spacing={2} sx={{ whiteSpace: 'pre-wrap' }}>
        <Typography id="public-profile-summary-title" component="h2" variant="h6" fontWeight={700}>프로필 요약</Typography>
        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={700}>{data.headline}</Typography>
          <Typography>{data.representativeExperience}</Typography>
        </Stack>
        <Box>
          <Typography component="h3" fontWeight={700}>일하는 방식</Typography>
          <Typography>{data.workingStyle}</Typography>
        </Box>
        <Stack spacing={1}>
          <Typography component="h3" fontWeight={700}>핵심 강점</Typography>
          {data.strengths.map((strength, index) => (
            <Box key={`${strength.title}-${index}`}>
              <Typography component="h4" fontWeight={700}>{strength.title}</Typography>
              <Typography color="text.secondary">{strength.evidence}</Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
