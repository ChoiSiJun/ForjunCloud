import { Avatar, Button, Grid, Paper, TextField, Typography, Dialog, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { usePersonal } from '@domain/personal/hooks/usePersonal';

interface BasicFormProps {
  personalHook: ReturnType<typeof usePersonal>;
}

const BasicForm = ({ personalHook }: BasicFormProps) => {
  const { formik, previewImage, handleFileChange } = personalHook;
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const handleImageClick = () => {
    if (previewImage) {
      setImageDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setImageDialogOpen(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        기본 정보
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src={previewImage || undefined}
            sx={{
              width: 120,
              height: 120,
              mb: 1,
              cursor: previewImage ? 'pointer' : 'default',
              '&:hover': previewImage ? { opacity: 0.8 } : {},
            }}
            onClick={handleImageClick}
          />
          <Button variant="contained" component="label" disabled={personalHook.isSaving}>
            이미지 선택
            <input type="file" disabled={personalHook.isSaving} hidden accept="image/*" onChange={handleFileChange} />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="이름"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={!!(formik.touched.name && formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="직무"
            name="job"
            value={formik.values.job}
            onChange={formik.handleChange}
            error={!!(formik.touched.job && formik.errors.job)}
            helperText={formik.touched.job && formik.errors.job}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="학력"
            name="education"
            value={formik.values.education || ''}
            onChange={formik.handleChange}
            error={!!(formik.touched.education && formik.errors.education)}
            helperText={formik.touched.education && formik.errors.education}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="학점"
            name="gradePointAverage"
            value={formik.values.gradePointAverage || ''}
            onChange={formik.handleChange}
            error={!!(formik.touched.gradePointAverage && formik.errors.gradePointAverage)}
            helperText={formik.touched.gradePointAverage && formik.errors.gradePointAverage}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="자기소개"
            name="introduction"
            value={formik.values.introduction || ''}
            onChange={formik.handleChange}
            error={!!(formik.touched.introduction && formik.errors.introduction)}
            helperText={formik.touched.introduction && formik.errors.introduction}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>

      {/* 이미지 확대 Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src={previewImage || ''}
            alt="프로필 이미지"
            sx={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default BasicForm;
