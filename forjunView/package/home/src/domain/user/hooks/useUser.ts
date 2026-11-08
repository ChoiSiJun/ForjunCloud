import { useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useUserQuery from '@domain/user/api/useUserQuery';
import { useUpdateUserMutation } from '@domain/user/api/useUpdateUserMutation';
import { UserDetailResponse } from '@domain/user/api/userApi';
import { toast } from 'react-toastify';
import { useAppSelector } from '@store/ReduxHooks';

export interface UserInfoFormValues {
  userName: string;
  email: string;
  historyPrivate: string;
  personalPrivate: string;
}

const FormValuesConvert = (userData: UserDetailResponse | undefined): UserInfoFormValues => {
  if (!userData) {
    return {
      userName: '',
      email: '',
      historyPrivate: 'PUBLIC',
      personalPrivate: 'PUBLIC',
    } as UserInfoFormValues;
  }

  return {
    userName: userData.userName || '',
    email: userData.email || '',
    historyPrivate: userData.historyPrivate || 'PUBLIC',
    personalPrivate: userData.personalPrivate || 'PUBLIC',
  } as UserInfoFormValues;
};

const useUser = () => {
  /** Query Client */
  const queryClient = useQueryClient();

  /** 로그인 상태 확인 */
  const jwtToken = useAppSelector(state => state.Auth.jwtToken);
  const isLoggedIn = !!jwtToken;

  /** 사용자 정보 조회 (로그인 상태일 때만 실행) */
  const userData = useUserQuery(isLoggedIn).data;

  /** 사용자 정보 수정 뮤테이션 */
  const { mutateAsync: updateUserMutation } = useUpdateUserMutation();

  /** 사용자 정보 Form 데이터 변환 */
  const loadedData = useMemo(() => {
    return FormValuesConvert(userData);
  }, [userData]);

  /** 사용자 정보 수정 Form */
  const userInfoFormik = useFormik<UserInfoFormValues>({
    initialValues: loadedData,
    enableReinitialize: true,
    validationSchema: Yup.object({
      userName: Yup.string().required('이름은 필수 항목입니다.'),
      email: Yup.string().email('이메일 형식이 아닙니다.').required('이메일은 필수 항목입니다.'),
      historyPrivate: Yup.string().required('히스토리 공개 설정은 필수 항목입니다.'),
      personalPrivate: Yup.string().required('자기소개서 공개 설정은 필수 항목입니다.'),
    }),
    onSubmit: async values => {
      try {
        await updateUserMutation(values);
        queryClient.invalidateQueries(['user']);
        toast.success('개인정보가 수정되었습니다.');
      } catch (error) {
        // 에러는 mutation에서 처리됨
      }
    },
  });

  return {
    userInfoFormik,
  };
};

export default useUser;
