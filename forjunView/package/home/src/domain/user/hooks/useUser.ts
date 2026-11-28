import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import useUserQuery from '../api/useUserQuery';
import { useUpdatePrivacyMutation, useUpdateProfileMutation } from '../api/useUserSettingsMutations';
import { Visibility } from '../api/userApi';

const useUser = () => {
  const user = useUserQuery();
  const update = useUpdateProfileMutation();
  const form = useFormik({
    initialValues: { userName: user.data?.userName ?? '', email: user.data?.email ?? '' },
    enableReinitialize: true,
    validationSchema: Yup.object({
      userName: Yup.string().trim().max(255, '이름은 255자 이내로 입력해 주세요.').required('이름은 필수 항목입니다.'),
      email: Yup.string().trim().max(255, '이메일은 255자 이내로 입력해 주세요.').email('이메일 형식이 아닙니다.').required('이메일은 필수 항목입니다.'),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!user.data) return;
      const profile = { userName: values.userName.trim(), email: values.email.trim() };
      try {
        await update.mutateAsync(profile);
        resetForm({ values: profile });
        toast.success('개인정보가 수정되었습니다.');
      } catch {
        toast.error('개인정보를 수정하지 못했습니다. 이름과 이메일을 확인한 뒤 다시 시도해 주세요.');
      }
    },
  });

  return { user, form };
};

export function usePrivacySettings() {
  const user = useUserQuery();
  const update = useUpdatePrivacyMutation();
  const form = useFormik<{ historyPrivate: Visibility; personalPrivate: Visibility }>({
    initialValues: {
      historyPrivate: user.data?.historyPrivate === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE',
      personalPrivate: user.data?.personalPrivate === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE',
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!user.data) return;
      try {
        await update.mutateAsync(values);
        resetForm({ values });
        toast.success('권한 설정을 저장했습니다.');
      } catch {
        toast.error('권한 설정을 저장하지 못했습니다. 다시 시도해 주세요.');
      }
    },
  });

  return { user, form };
}

export default useUser;
