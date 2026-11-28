import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUpdatePasswordMutation } from '../api/useUserSettingsMutations';
import { passwordPattern, passwordRequirements } from '../user';

export default function usePasswordSettings() {
  const updatePassword = useUpdatePasswordMutation();
  const [feedback, setFeedback] = useState<{ error: boolean; text: string }>();
  const form = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmation: '' },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('현재 비밀번호를 입력해 주세요.'),
      newPassword: Yup.string()
        .required('새 비밀번호를 입력해 주세요.')
        .matches(passwordPattern, passwordRequirements)
        .test('password-byte-length', '새 비밀번호는 UTF-8 기준 72바이트 이내로 입력해 주세요.',
          value => !value || new TextEncoder().encode(value).length <= 72),
      confirmation: Yup.string().oneOf([Yup.ref('newPassword')], '새 비밀번호가 일치하지 않습니다.').required('새 비밀번호를 한 번 더 입력해 주세요.'),
    }),
    onSubmit: async ({ currentPassword, newPassword }, { resetForm, setFieldValue }) => {
      setFeedback(undefined);
      try {
        await updatePassword({ currentPassword, newPassword });
        resetForm();
        setFeedback({ error: false, text: '비밀번호를 변경했습니다.' });
      } catch (error) {
        const code = error instanceof Error ? error.message : undefined;
        let text = '비밀번호를 변경하지 못했습니다. 잠시 후 다시 시도해 주세요.';
        if (code === 'PASSWORD_NOT_MATCH') text = '현재 비밀번호를 확인해 주세요.';
        if (code === 'PASSWORD_CHANGED') text = '비밀번호가 변경되었습니다. 현재 비밀번호를 다시 입력해 주세요.';
        if (code === 'VALIDATION_FAILED') text = '입력한 비밀번호를 확인해 주세요.';
        if (code === 'PASSWORD_NOT_MATCH' || code === 'PASSWORD_CHANGED') await setFieldValue('currentPassword', '', false);
        setFeedback({ error: true, text });
      }
    },
  });

  return { form, feedback, clearFeedback: () => setFeedback(undefined) };
}
