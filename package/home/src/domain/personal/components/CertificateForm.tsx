import SjTextField from '@common/ui/elements/input/SjTextField';
import SjText from '@common/ui/elements/text/SjText';
import { Grid, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SjButton from '@common/ui/elements/button/SjButton';
import { usePersonal } from '@domain/personal/hooks/usePersonal';

interface CertificateFormProps {
  personalHook: ReturnType<typeof usePersonal>;
}

const CertificateForm = ({ personalHook }: CertificateFormProps) => {
  const { certificates, handleCertificateChange, handleRemoveCertificate, handleAddCertificate } = personalHook;

  return (
    <Paper sx={{ p: 3 }}>
      <SjText text="자격증정보" renderType="title" />
      {certificates.map((entry, idx) => (
        <Grid container spacing={1} key={idx} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <SjTextField label="자격증명" value={entry.certificateName} onChange={e => handleCertificateChange(idx, 'certificateName', e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <SjTextField label="취득기관" value={entry.certificateAcquisitionOrganization} onChange={e => handleCertificateChange(idx, 'certificateAcquisitionOrganization', e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <SjTextField label="취득일 (YYYY.MM.YY)" value={entry.certificateAcquisitionDate} onChange={e => handleCertificateChange(idx, 'certificateAcquisitionDate', e.target.value)} />
          </Grid>
          <Grid item xs={2}>
            <IconButton color="error" onClick={() => handleRemoveCertificate(idx)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <SjButton ButtonType="input" buttonName="자격증추가" onClick={handleAddCertificate} />
    </Paper>
  );
};

export default CertificateForm;
