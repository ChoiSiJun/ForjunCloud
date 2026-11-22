import { Alert, Box, Button, Chip, Paper, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { Link } from 'react-router-dom';
import useDashboardPageViews from '@domain/pageview/hooks/useDashboardPageViews';

const historyLinks = [
  { title: 'SI', to: '/forjun/history/si' },
  { title: 'SM', to: '/forjun/history/sm' },
  { title: 'R&D', to: '/forjun/history/rnd' },
  { title: '토이 프로젝트', to: '/forjun/history/toy' },
];

const countFormat = new Intl.NumberFormat('ko-KR');

export default function Dashboard() {
  const theme = useTheme();
  const { data, isLoading, isError, isFetching, refetch } = useDashboardPageViews();
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

        <Paper component="section" variant="outlined" aria-labelledby="manage-content-title" sx={{ borderRadius: 3, p: { xs: 2, md: 3 } }}>
          <Typography id="manage-content-title" component="h3" variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            내 콘텐츠 관리
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
            <Button component={Link} to="/forjun/personal" variant="contained">자기소개서 수정</Button>
            {historyLinks.map(({ title, to }) => (
              <Button key={to} component={Link} to={to} variant="outlined">{title} 경력 관리</Button>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
