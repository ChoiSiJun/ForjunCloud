import { useEffect, useRef } from 'react';
import { Alert, Avatar, Box, Button, Chip, CircularProgress, Divider, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { Work as WorkIcon, School as SchoolIcon, EmojiEvents as AwardIcon, Verified as CertificateIcon, Code as CodeIcon, Person as PersonIcon } from '@mui/icons-material';
import usePublicPersonal from '@domain/personal/hooks/usePublicPersonal';
import useRecordPublicPageView from '@domain/pageview/hooks/useRecordPublicPageView';
import { usePublicProfileSummary } from '@domain/profile-summary/hooks/useProfileSummary';
import WepContentBox from '@pages/web/components/WebContentBox';
import PublicProfileSummary from '@pages/web/profile-summary';

const OpenPersonal = () => {
  const { userId } = useParams();
  const { hash } = useLocation();
  const personal = usePublicPersonal(userId || '');
  const summary = usePublicProfileSummary(userId || '');
  const summaryRef = useRef<HTMLDivElement>(null);
  const isLoading = personal.isLoading || (!personal.isFetchedAfterMount && personal.isFetching);
  const isError = personal.isFetchedAfterMount && personal.isError;
  const personalData = personal.isFetchedAfterMount && personal.isSuccess ? personal.data : undefined;
  const summaryLoading = summary.isLoading || (!summary.isFetchedAfterMount && summary.isFetching);
  const summaryError = summary.isFetchedAfterMount && summary.isError;
  const publishedSummary = summary.isFetchedAfterMount && summary.isSuccess && summary.data?.published ? summary.data : undefined;
  const requestedSummary = hash === '#profile-summary';
  useRecordPublicPageView(userId, 'PERSONAL', Boolean(personalData));
  const theme = useTheme();

  useEffect(() => {
    if (requestedSummary) summaryRef.current?.scrollIntoView({ block: 'start' });
  }, [requestedSummary, isLoading, isError, summaryLoading, summaryError, publishedSummary]);

  const summarySection = (publishedSummary || summaryLoading || summaryError || requestedSummary) && (
    <Box id="profile-summary" ref={summaryRef} sx={{ gridColumn: '1 / -1' }}>
      {publishedSummary && <PublicProfileSummary data={publishedSummary} />}
      {summaryLoading && <CircularProgress size={24} aria-label="프로필 요약 불러오는 중" />}
      {summaryError && (
        <Alert severity="error" action={<Button color="inherit" disabled={summary.isFetching} onClick={() => summary.refetch()}>다시 시도</Button>}>
          프로필 요약을 불러오지 못했습니다.
        </Alert>
      )}
      {requestedSummary && summary.isFetchedAfterMount && summary.isSuccess && !publishedSummary && (
        <Typography color="text.secondary">공개된 프로필 요약이 없습니다.</Typography>
      )}
    </Box>
  );

  if (isLoading || isError || !personalData) {
    return (
      <WepContentBox color="#000" bgColor="#f5f7fa">
        <Stack spacing={2} sx={{ width: '90%', maxWidth: 1200, py: { xs: 3, md: 5 } }}>
          {summarySection}
          {isLoading && <Typography role="status" color="text.secondary">프로필 정보를 불러오는 중...</Typography>}
          {!isLoading && isError && <Alert severity="error">프로필 정보를 불러올 수 없습니다.</Alert>}
          {!isLoading && !isError && !publishedSummary && !summaryLoading && (
            <Typography color="text.secondary">공개된 자기소개서가 없습니다.</Typography>
          )}
        </Stack>
      </WepContentBox>
    );
  }

  // 기술을 카테고리별로 그룹화
  const groupedSkills = personalData.skills?.reduce(
    (acc, skill) => {
      const category = skill.skillCategory || '기타';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill.skillName);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return (
    <WepContentBox color="#000" bgColor="#f5f7fa">
      <Box
        sx={{
          width: { xs: '95%', sm: '90%', md: '85%', lg: '1200px' },
          maxWidth: 1200,
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: '320px minmax(0, 1fr)' },
          alignItems: 'start',
          gap: 4,
          py: { xs: 3, md: 5 },
        }}
      >
          {/* 프로필 카드 */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              gridColumn: '1 / -1',
              background: `linear-gradient(135deg, ${theme.palette?.primary?.main || '#21438f'} 0%, ${theme.palette?.primary?.dark || '#152548'} 100%)`,
              borderRadius: 3,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 70%)`,
                borderRadius: '50%',
                transform: 'translate(30%, -30%)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Avatar
                src={personalData.profileImageUrl || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  border: '4px solid white',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              />
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  textAlign: 'center',
                }}
              >
                {personalData.name || '-'}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  opacity: 0.9,
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                {personalData.job || '-'}
              </Typography>
            </Box>
          </Paper>

          {summarySection}

          {/* 기본 정보 카드 */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: theme.palette?.primary?.main || '#21438f' }} />
              <Typography variant="h6" fontWeight={600}>
                기본 정보
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {personalData.education && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <SchoolIcon sx={{ fontSize: 18, mr: 1, color: theme.palette?.text?.secondary || '#5A6A85' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      학력
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    {personalData.education}
                  </Typography>
                </Box>
              )}
              {personalData.gradePointAverage && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ ml: 4 }}>
                    학점
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 4 }}>
                    {personalData.gradePointAverage}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        {/* 메인 컨텐츠 영역 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {/* 자기소개 */}
          {personalData.introduction && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'white',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.3)} 0%, transparent 100%)`,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mb: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                자기소개
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  color: theme.palette.text.primary,
                  fontSize: '1.05rem',
                }}
              >
                {personalData.introduction}
              </Typography>
            </Paper>
          )}

          {/* 회사 정보 */}
          {personalData.companies && personalData.companies.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <WorkIcon sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700}>
                  경력 사항
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                {personalData.companies.map((company, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.light, 0.1),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5 }}>
                          회사명
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="primary">
                          {company.companyName || '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5 }}>
                          입사일
                        </Typography>
                        <Typography variant="body1">{company.startDate || '-'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5 }}>
                          퇴사일
                        </Typography>
                        <Typography variant="body1">{company.endDate || '재직 중'}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* 기술 내역 */}
          {groupedSkills && Object.keys(groupedSkills).length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CodeIcon sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700}>
                  기술 스택
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                {Object.entries(groupedSkills).map(([category, skills]) => (
                  <Box key={category}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        mb: 2,
                        color: theme.palette.text.primary,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 4,
                          height: 20,
                          bgcolor: theme.palette.primary.main,
                          borderRadius: 1,
                          mr: 1.5,
                        }}
                      />
                      {category}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {skills.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            height: 36,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* 자격증 정보 */}
          {personalData.certificates && personalData.certificates.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CertificateIcon sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700}>
                  자격증
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={2}>
                {personalData.certificates.map((certificate, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.light, 0.1),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        borderColor: alpha(theme.palette.success.main, 0.4),
                      },
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5 }}>
                          자격증명
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="success.dark">
                          {certificate.certificateName || '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5 }}>
                          취득기관
                        </Typography>
                        <Typography variant="body1">{certificate.certificateAcquisitionOrganization || '-'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5 }}>
                          취득일
                        </Typography>
                        <Typography variant="body1">{certificate.certificateAcquisitionDate || '-'}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* 수상 내역 */}
          {personalData.awards && personalData.awards.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AwardIcon sx={{ mr: 1.5, color: theme.palette.warning.main, fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700}>
                  수상 내역
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {personalData.awards.map((award, idx) => (
                  <Chip
                    key={idx}
                    label={award.awardName}
                    icon={<AwardIcon />}
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.dark,
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      height: 40,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.warning.main, 0.2),
                      },
                    }}
                  />
                ))}
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </WepContentBox>
  );
};

export default OpenPersonal;
