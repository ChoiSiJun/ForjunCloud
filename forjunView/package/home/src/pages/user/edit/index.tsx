import { Box, Paper, Grid } from '@mui/material';
import SjButton from '@common/ui/elements/button/SjButton';
import SjTextField from '@common/ui/elements/input/SjTextField';
import SjSelectBox from '@common/ui/elements/input/SjSelectBox';
import SjText from '@common/ui/elements/text/SjText';
import useUser from '@domain/user/hooks/useUser';

const UserEdit = () => {
  const userHook = useUser();

  return (
    <form onSubmit={userHook.userInfoFormik.handleSubmit}>
      <Box
        sx={{
          p: 3,
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Paper sx={{ p: 3 }}>
          <SjText text="개인정보 수정" renderType="title" />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SjTextField
                label="이름"
                name="userName"
                value={userHook.userInfoFormik.values.userName}
                onChange={userHook.userInfoFormik.handleChange}
                error={!!(userHook.userInfoFormik.touched.userName && userHook.userInfoFormik.errors.userName)}
                helperText={userHook.userInfoFormik.touched.userName && userHook.userInfoFormik.errors.userName ? userHook.userInfoFormik.errors.userName : undefined}
              />
            </Grid>
            <Grid item xs={12}>
              <SjTextField
                label="이메일"
                name="email"
                type="email"
                value={userHook.userInfoFormik.values.email}
                onChange={userHook.userInfoFormik.handleChange}
                error={!!(userHook.userInfoFormik.touched.email && userHook.userInfoFormik.errors.email)}
                helperText={userHook.userInfoFormik.touched.email && userHook.userInfoFormik.errors.email ? userHook.userInfoFormik.errors.email : undefined}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SjSelectBox
                menuItem={[
                  { name: '공개', value: 'PUBLIC' },
                  { name: '비공개', value: 'PRIVATE' },
                ]}
                defaultValue={userHook.userInfoFormik.values.historyPrivate}
                label="히스토리 공개 설정"
                name="historyPrivate"
                onChange={userHook.userInfoFormik.handleChange}
              />
              {userHook.userInfoFormik.touched.historyPrivate && userHook.userInfoFormik.errors.historyPrivate && (
                <SjText text={userHook.userInfoFormik.errors.historyPrivate} variant="caption" sx={{ mt: 0.5, ml: 1.75 }} color="error" />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <SjSelectBox
                menuItem={[
                  { name: '공개', value: 'PUBLIC' },
                  { name: '비공개', value: 'PRIVATE' },
                ]}
                defaultValue={userHook.userInfoFormik.values.personalPrivate}
                label="자기소개서 공개 설정"
                name="personalPrivate"
                onChange={userHook.userInfoFormik.handleChange}
              />
              {userHook.userInfoFormik.touched.personalPrivate && userHook.userInfoFormik.errors.personalPrivate && (
                <SjText text={userHook.userInfoFormik.errors.personalPrivate} variant="caption" sx={{ mt: 0.5, ml: 1.75 }} color="error" />
              )}
            </Grid>
          </Grid>
        </Paper>

        <SjButton ButtonType="submit" buttonName="수정하기" />
      </Box>
    </form>
  );
};

export default UserEdit;
