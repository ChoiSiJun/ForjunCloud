import { Box } from '@mui/material';

import SjButton from '@common/ui/elements/button/SjButton';
import CompanyForm from '../../domain/personal/components/CompanyForm';
import AwardForm from '../../domain/personal/components/AwardForm';
import SkillForm from '../../domain/personal/components/SkillForm';
import CertificateForm from '../../domain/personal/components/CertificateForm';
import { usePersonal } from '../../domain/personal/hooks/usePersonal';
import BasicForm from '../../domain/personal/components/BasicForm';

const Personal = () => {
  const personalHook = usePersonal();

  return (
    <form onSubmit={personalHook.formik.handleSubmit}>
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
        {/* 기본 정보 */}
        <BasicForm personalHook={personalHook} />

        {/* 회사 정보 */}
        <CompanyForm personalHook={personalHook} />

        {/* 기술 */}
        <SkillForm personalHook={personalHook} />
        {/* 자격증 정보 */}
        <CertificateForm personalHook={personalHook} />

        {/* 수상 내역 */}
        <AwardForm personalHook={personalHook} />

        {/* 제출 버튼 */}
        <SjButton ButtonType="submit" buttonName="등록 수정" disabled={personalHook.isSaving || personalHook.formik.isSubmitting} />
      </Box>
    </form>
  );
};

export default Personal;
