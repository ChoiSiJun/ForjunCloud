import { useState } from 'react';
import { Alert, Box, Button, Chip, Paper, Skeleton, Stack, TextField, Typography, useTheme } from '@mui/material';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import { LineChart } from '@mui/x-charts/LineChart';
import { Link, useHref } from 'react-router-dom';
import useDashboardPageViews from '@domain/pageview/hooks/useDashboardPageViews';
import useUserQuery from '@domain/user/api/useUserQuery';
import { useAppSelector } from 'store/ReduxHooks';

const historyLinks = [
  { title: 'SI', path: 'history/si' },
  { title: 'SM', path: 'history/sm' },
  { title: 'R&D', path: 'history/rnd' },
  { title: '토이 프로젝트', path: 'history/toy' },
];

const countFormat = new Intl.NumberFormat('ko-KR');

function ContentActions({ title, manageTo, visitorTo, primary = false }: {
  title: string;
  manageTo: string;
  visitorTo?: string;
  primary?: boolean;
}) {
  const href = useHref(visitorTo ?? manageTo);
  const [copyResult, setCopyResult] = useState<{ url: string; copied: boolean }>();

  const copyLink = async () => {
    const url = new URL(href, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setCopyResult({ url, copied: true });
    } catch {
      setCopyResult({ url, copied: false });
    }
  };

  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" alignItems="center"
        sx={{ '& .MuiButton-root': { minHeight: { xs: 40, md: 32 } } }}>
        <Button component={Link} to={manageTo} variant={primary ? 'contained' : 'outlined'}
          size={primary ? 'medium' : 'small'} aria-label={`${title} ${primary ? '수정' : '관리'}`}>
          {primary ? '수정' : '관리'}
        </Button>
        {visitorTo && (
          <>
            <Button component={Link} to={visitorTo} target="_blank" rel="noopener noreferrer" size="small"
              startIcon={<OpenInNewRounded />} aria-label={`${title} 방문자 화면 보기`}>
              방문자 화면
            </Button>
            <Button onClick={copyLink} size="small" startIcon={<ContentCopyRounded />} aria-label={`${title} 링크 복사`}>
              링크 복사
            </Button>
          </>
        )}
      </Stack>
      {visitorTo && copyResult?.copied && <Typography role="status" variant="body2">링크를 복사했습니다.</Typography>}
      {visitorTo && copyResult && !copyResult.copied && (
        <>
          <Alert severity="warning">자동 복사가 되지 않았습니다. 아래 주소를 직접 복사해 주세요.</Alert>
          <TextField label={`${title} 방문자 주소`} value={copyResult.url} size="small" fullWidth
            inputProps={{ readOnly: true }} onFocus={event => event.target.select()} />
        </>
      )}
    </Stack>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const { data, isLoading, isError, isFetching, refetch } = useDashboardPageViews();
  const userId = useAppSelector(state => state.Auth.userId);
  const user = useUserQuery(Boolean(userId));
  const visitorProfile = `/web/${encodeURIComponent(userId)}/profile`;
  const hasPrivacy = Boolean(user.data) && !user.isError;
  const personalPublic = user.data?.personalPrivate === 'PUBLIC';
  const historyPublic = user.data?.historyPrivate === 'PUBLIC';
  const canShareHistory = hasPrivacy && historyPublic;
  const totals = data?.reduce(
    (sum, day) => ({ personal: sum.personal + day.personalViews, history: sum.history + day.historyViews }),
    { personal: 0, history: 0 },
  );
  const dates = data?.map(day => day.date) ?? [];
  const ticks = dates.filter((_, index) => (index % 7 === 0 && index < dates.length - 3) || index === dates.length - 1);
  const metrics = [
    { label: '전체 조회수', value: totals ? totals.personal + totals.history : undefined, color: 'text.primary' },
    { label: '자기소개서', value: totals?.personal, color: theme.palette.primary.main },
    { label: '경력', value: totals?.history, color: theme.palette.success.dark },
  ];

  return (
    <Box component="section" aria-labelledby="dashboard-title" sx={{ maxWidth: 1120, mx: 'auto', py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Typography id="dashboard-title" component="h2" variant="h4" fontWeight={700}>
          대시보드
        </Typography>

        <Paper component="section" variant="outlined" aria-labelledby="page-view-title" sx={{ borderRadius: 3, p: { xs: 2, md: 3 } }}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
            <Typography id="page-view-title" component="h3" variant="h6" fontWeight={700}>
              공개 페이지 조회 추이
            </Typography>
            <Chip label="최근 30일 · 한국 시간" size="small" />
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5, my: 2 }}>
            {metrics.map(metric => (
              <Box key={metric.label} sx={{ bgcolor: 'action.hover', borderRadius: 2, px: 2, py: 1.5 }}>
                <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
                <Typography variant="h5" component="p" fontWeight={700} color={metric.color}>
                  {metric.value === undefined ? '—' : `${countFormat.format(metric.value)}회`}
                </Typography>
              </Box>
            ))}
          </Box>

          {isLoading && <Skeleton variant="rounded" height={260} role="status" aria-label="조회수 불러오는 중" />}
          {isError && (
            <Alert severity="error" action={<Button color="inherit" disabled={isFetching} onClick={() => refetch()}>다시 시도</Button>}>
              조회수를 불러오지 못했습니다.
            </Alert>
          )}
          {data && totals && totals.personal + totals.history > 0 && (
            <Box role="group" aria-label="일별 자기소개서와 경력 공개 페이지 조회수">
              <LineChart
                height={280}
                margin={{ left: 48, right: 22, top: 12, bottom: 34 }}
                xAxis={[{ scaleType: 'point', data: dates, tickInterval: ticks, valueFormatter: date => date.slice(5).replace('-', '.') }]}
                yAxis={[{ min: 0, tickMinStep: 1 }]}
                series={[
                  { label: '자기소개서', data: data.map(day => day.personalViews), color: theme.palette.primary.main, showMark: false, curve: 'linear' },
                  { label: '경력', data: data.map(day => day.historyViews), color: theme.palette.success.dark, showMark: false, curve: 'linear' },
                ]}
                grid={{ horizontal: true }}
                slotProps={{ legend: { hidden: true } }}
              />
            </Box>
          )}
          {totals && totals.personal + totals.history === 0 && (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              최근 30일 동안 집계된 공개 페이지 조회가 없습니다.
            </Typography>
          )}
        </Paper>

        <Stack component="section" aria-labelledby="manage-content-title" spacing={2}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center" justifyContent="space-between">
            <Typography id="manage-content-title" component="h3" variant="h6" fontWeight={700}>
              내 콘텐츠 관리
            </Typography>
            {hasPrivacy && <Button component={Link} to="/forjun/user/settings/privacy" size="small" sx={{ minHeight: { xs: 40, md: 32 } }}>공개 설정</Button>}
          </Stack>
          {user.isError && (
            <Alert severity="error" action={<Button color="inherit" disabled={user.isFetching} onClick={() => user.refetch()}>다시 시도</Button>}>
              공개 설정을 불러오지 못했습니다.
            </Alert>
          )}
          {user.isLoading && <Skeleton role="status" aria-label="공개 설정 불러오는 중" sx={{ maxWidth: 160 }} />}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 2fr) minmax(0, 3fr)' }, gap: 2, alignItems: 'start' }}>
            <Paper component="section" aria-labelledby="manage-personal-title" variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, md: 2.5 } }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography id="manage-personal-title" component="h4" fontWeight={700}>자기소개서</Typography>
                  {hasPrivacy && <Chip label={personalPublic ? '공개' : '비공개'} color={personalPublic ? 'success' : 'default'} variant="outlined" size="small" />}
                </Stack>
                <ContentActions key={visitorProfile} title="자기소개서" manageTo="/forjun/personal-statement"
                  visitorTo={hasPrivacy && personalPublic ? `${visitorProfile}/personal` : undefined} primary />
              </Stack>
            </Paper>
            <Paper component="section" aria-labelledby="manage-history-title" variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, md: 2.5 } }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography id="manage-history-title" component="h4" fontWeight={700}>경력</Typography>
                {hasPrivacy && <Chip label={historyPublic ? '공개' : '비공개'} color={historyPublic ? 'success' : 'default'} variant="outlined" size="small" />}
              </Stack>
              <Box component="ul" sx={{ m: 0, mt: 1.5, p: 0, listStyle: 'none' }}>
                {historyLinks.map(({ title, path }) => (
                  <Box component="li" key={`${visitorProfile}/${path}`} sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: canShareHistory ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) auto',
                      sm: canShareHistory ? 'minmax(90px, auto) minmax(0, 1fr)' : 'minmax(0, 1fr) auto',
                    },
                    alignItems: 'start', rowGap: 0.5, columnGap: 1, py: 1,
                    borderTop: 1, borderColor: 'divider', '&:last-child': { pb: 0 },
                  }}>
                    <Typography variant="body2" fontWeight={600} sx={{ pt: 0.5 }}>{title}</Typography>
                    <ContentActions title={`${title} 경력`} manageTo={`/forjun/${path}`}
                      visitorTo={canShareHistory ? `${visitorProfile}/${path}` : undefined} />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
