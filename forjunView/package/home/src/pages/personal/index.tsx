import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import SjButton from '@common/ui/elements/button/SjButton';
import ProfileSummarySection from '@pages/profile-summary';
import CompanyForm from '../../domain/personal/components/CompanyForm';
import AwardForm from '../../domain/personal/components/AwardForm';
import SkillForm from '../../domain/personal/components/SkillForm';
import CertificateForm from '../../domain/personal/components/CertificateForm';
import { usePersonal } from '../../domain/personal/hooks/usePersonal';
import BasicForm from '../../domain/personal/components/BasicForm';

const Personal = () => {
  const personalHook = usePersonal();
  const { initialValues } = personalHook.formik;
  const { hash } = useLocation();
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hash === '#profile-summary') summaryRef.current?.scrollIntoView({ block: 'start' });
  }, [hash, initialValues]);

  return (
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
      <Box component="form" onSubmit={personalHook.formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
        <SjButton ButtonType="submit" buttonName="저장" disabled={personalHook.isSaving || personalHook.formik.isSubmitting} />
      </Box>
      <Box ref={summaryRef} id="profile-summary">
        <ProfileSummarySection />
      </Box>
    </Box>
  );
};

export default Personal;
