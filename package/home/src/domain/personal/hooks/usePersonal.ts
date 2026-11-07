import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AxiosError } from 'axios';
import { useQueryClient } from 'react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import usePersonalQuery, { fetchPersonal } from '@domain/personal/api/usePersonalQuery';
import usePersonaSaveMutation from '@domain/personal/api/usePersonalSaveMutation';
import useFileUploadMutation from '@domain/upload/api/useFileUploadMutation';
import useFileDeleteMutation from '@domain/upload/api/useFileDeleteMutation';

import { Personal, PersonalAwards, PersonalCompany, PersonalSkill, PersonalCertificate } from '@domain/personal/Personal';
import { PersonalDetailResponse, PersonalSaveRequest } from '@domain/personal/api/personalApi';

/** Form 형식 */
export interface PersonalFormValues extends Personal {
  awards: PersonalAwardsFormValues[];
  companies: PersonalCompanyFormValues[];
  skills: PersonalSkillFormValues[];
  certificates: PersonalCertificateFormValues[];
}

/** Form 형식 */
export interface PersonalAwardsFormValues extends PersonalAwards {}

/** Form 형식 */
export interface PersonalCompanyFormValues extends PersonalCompany {}

/** Form 형식 */
export interface PersonalSkillFormValues extends PersonalSkill {}

/** Form 형식 */
export interface PersonalCertificateFormValues extends PersonalCertificate {}

/** Form 형식으로 파싱 */
const FormValuesConvert = (personalData: PersonalDetailResponse | undefined) => {
  if (!personalData) {
    return {
      name: '',
      job: '',
      profileImageUrl: null,
      profileImageId: null,
      education: '',
      gradePointAverage: '',
      introduction: '',
      companies: [],
      awards: [],
      skills: [],
      certificates: [],
    } as PersonalFormValues;
  }

  return {
    ...personalData,
    profileImageId: personalData.profileImageId ?? null,
    profileImageUrl: personalData.profileImageUrl ?? null,
    companies: personalData.companies || [],
    awards: personalData.awards || [],
    skills: personalData.skills || [],
    certificates: personalData.certificates || [],
  } as PersonalFormValues;
};

export const usePersonal = () => {
  // API 데이터
  const personalData = usePersonalQuery().data;

  // API 데이터를 Form 형식으로 파싱
  const loadedData = useMemo(() => {
    return FormValuesConvert(personalData);
  }, [personalData]);

  // Query Client
  const queryClient = useQueryClient();

  /** API Mutation */

  // 파일 업로드 Mutation
  const { mutateAsync: fileUploadMutation } = useFileUploadMutation();

  // 파일 삭제 Mutation
  const { mutateAsync: fileDeleteMutation } = useFileDeleteMutation();

  // 자기소개서 저장 Mutation
  const { mutateAsync: personalSaveMutation } = usePersonaSaveMutation();

  /** 상태관리 */

  // 미리보기 이미지 상태
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 실제 파일 이미지 상태
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const submitting = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form
  const formik = useFormik<PersonalFormValues>({
    initialValues: loadedData,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('이름은 필수입니다.'),
      job: Yup.string().required('직무는 필수입니다.'),
    }),
    onSubmit: async currentValues => {
      if (submitting.current) return;
      submitting.current = true;
      setIsSaving(true);
      const previousId = currentValues.profileImageId;
      let uploadedFileId: string | null = null;
      try {
        let imageId = previousId;
        if (profileImage) {
          const response = await fileUploadMutation({ uploadFile: profileImage, directory: 'profile' });
          uploadedFileId = response.fileId;
          imageId = response.fileId;
          await formik.setFieldValue('profileImageId', imageId, false);
        }
        const submitData: PersonalSaveRequest = {
          name: currentValues.name,
          job: currentValues.job,
          profile_image_id: imageId,
          education: currentValues.education,
          grade_point_average: currentValues.gradePointAverage,
          introduction: currentValues.introduction,
          awards: currentValues.awards.map(item => ({ award_name: item.awardName })),
          companies: currentValues.companies.map(item => ({ company_name: item.companyName, start_date: item.startDate, end_date: item.endDate })),
          skills: currentValues.skills.map(item => ({ skill_category: item.skillCategory, skill_name: item.skillName })),
          certificates: currentValues.certificates.map(item => ({
            certificate_name: item.certificateName,
            certificate_acquisition_organization: item.certificateAcquisitionOrganization,
            certificate_acquisition_date: item.certificateAcquisitionDate,
          })),
        };
        await personalSaveMutation(submitData);
        setProfileImage(null);
        queryClient.invalidateQueries(['personal']);
        toast.success('등록되었습니다.');
      } catch (error) {
        if (uploadedFileId) {
          const uncertain = !(error instanceof AxiosError) || !error.response || error.response.status >= 500 || error.response.status === 408;
          if (uncertain) {
            try {
              const saved = await fetchPersonal();
              if (saved.profileImageId === uploadedFileId) {
                setProfileImage(null);
                queryClient.setQueryData(['personal'], saved);
                queryClient.invalidateQueries(['personal']);
                toast.success('저장된 내용을 확인했습니다.');
                return;
              }
            } catch {
              toast.error('저장 결과를 확인할 수 없습니다. 다시 조회한 후 저장해주세요.');
              await formik.setFieldValue('profileImageId', previousId, false);
              return;
            }
          }
          await formik.setFieldValue('profileImageId', previousId, false);
          try {
            await fileDeleteMutation(uploadedFileId);
          } catch {
            toast.error('새 업로드 파일 정리에 실패했습니다.');
          }
        }
      } finally {
        submitting.current = false;
        setIsSaving(false);
      }
    },
  });

  // 이미지 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || submitting.current) return;
    setProfileImage(file);
    e.target.value = '';
  };

  // 리스트 추가/삭제
  const handleAddListItem = useCallback(
    (field: 'awards' | 'skills', value: string | { skillCategory: string; skillName: string }) => {
      if (field === 'awards') {
        if (typeof value !== 'string' || !value) return;
        const newItem = { awardName: value };
        const updatedList = [...formik.values.awards, newItem];
        formik.setFieldValue(field, updatedList);
      } else {
        // skills
        if (typeof value === 'string' || !value || typeof value !== 'object') return;
        if (!value.skillCategory || !value.skillName) return;
        const newItem = { skillCategory: value.skillCategory, skillName: value.skillName };
        const updatedList = [...formik.values.skills, newItem];
        formik.setFieldValue(field, updatedList);
      }
    },
    [formik],
  );

  const handleRemoveListItem = useCallback(
    (field: 'awards' | 'skills', index: number) => {
      const currentList = field === 'awards' ? formik.values.awards : formik.values.skills;
      const updatedList = currentList.filter((_, i) => i !== index);

      formik.setFieldValue(field, updatedList);
    },
    [formik],
  );

  // 회사 추가
  const handleAddCompany = useCallback(() => {
    const updatedCompanies = [...formik.values.companies, { companyName: '', startDate: '', endDate: '' }];
    formik.setFieldValue('companies', updatedCompanies);
  }, [formik]);

  // 회사 삭제
  const handleRemoveCompany = useCallback(
    (index: number) => {
      const currentCompanies = formik.values.companies;
      let updatedCompanies: PersonalCompanyFormValues[];

      if (index === 0) {
        updatedCompanies = [...currentCompanies];
        updatedCompanies[0] = { companyName: '', startDate: '', endDate: '' };
      } else {
        updatedCompanies = currentCompanies.filter((_, i) => i !== index);
      }

      formik.setFieldValue('companies', updatedCompanies);
    },
    [formik],
  );

  // 회사 변경
  const handleCompanyChange = useCallback(
    (index: number, field: keyof PersonalCompanyFormValues, value: string) => {
      const currentCompanies = formik.values.companies;
      const updatedCompanies = [...currentCompanies];
      updatedCompanies[index] = { ...updatedCompanies[index], [field]: value };

      formik.setFieldValue('companies', updatedCompanies);
    },
    [formik],
  );

  // 자격증 추가
  const handleAddCertificate = useCallback(() => {
    const updatedCertificates = [...formik.values.certificates, { certificateName: '', certificateAcquisitionOrganization: '', certificateAcquisitionDate: '' }];
    formik.setFieldValue('certificates', updatedCertificates);
  }, [formik]);

  // 자격증 삭제
  const handleRemoveCertificate = useCallback(
    (index: number) => {
      const currentCertificates = formik.values.certificates;
      let updatedCertificates: PersonalCertificateFormValues[];

      if (index === 0) {
        updatedCertificates = [...currentCertificates];
        updatedCertificates[0] = {
          certificateName: '',
          certificateAcquisitionOrganization: '',
          certificateAcquisitionDate: '',
        };
      } else {
        updatedCertificates = currentCertificates.filter((_, i) => i !== index);
      }

      formik.setFieldValue('certificates', updatedCertificates);
    },
    [formik],
  );

  // 자격증 변경
  const handleCertificateChange = useCallback(
    (index: number, field: keyof PersonalCertificateFormValues, value: string) => {
      const currentCertificates = formik.values.certificates;
      const updatedCertificates = [...currentCertificates];
      updatedCertificates[index] = { ...updatedCertificates[index], [field]: value };

      formik.setFieldValue('certificates', updatedCertificates);
    },
    [formik],
  );

  useEffect(() => {
    if (!profileImage) {
      setPreviewImage(loadedData.profileImageUrl);
      return undefined;
    }
    const url = URL.createObjectURL(profileImage);
    setPreviewImage(url);
    return () => URL.revokeObjectURL(url);
  }, [profileImage, loadedData.profileImageUrl]);

  return {
    formik,
    isSaving,
    previewImage,
    handleFileChange,
    companies: formik.values.companies,
    skills: formik.values.skills,
    awards: formik.values.awards,
    certificates: formik.values.certificates,
    handleAddListItem,
    handleRemoveListItem,
    handleAddCompany,
    handleRemoveCompany,
    handleCompanyChange,
    handleAddCertificate,
    handleRemoveCertificate,
    handleCertificateChange,
  };
};
