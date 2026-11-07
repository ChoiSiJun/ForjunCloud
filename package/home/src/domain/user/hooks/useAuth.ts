import { useState } from 'react';
import { useJoinUserMutation } from '@domain/user/api/useJoinUserMutation';
import { useLoginUserMutation } from '@domain/user/api/useLoginUserMutation';
import { fetchIdDuplicateCheck } from '@domain/user/api/useDuplicateIdCheckUserQuery';
import { USER_API_ENDPOINTS } from '@domain/user/api/userApi';
import { GetRequestType } from '@common/utill/type-utils';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@store/ReduxHooks';
import { authInsert } from '@store/slice/AuthSlice';

const useAuth = () => {
  /** Types */
  type JoinUserRequest = GetRequestType<typeof USER_API_ENDPOINTS.join>;
  type LoginUserRequest = GetRequestType<typeof USER_API_ENDPOINTS.login>;
  type DuplicateIdCheckUserRequest = GetRequestType<typeof USER_API_ENDPOINTS.duplicateCheckId>;

  /** Mutation */
  const dispatch = useAppDispatch();

  /** 회원가입 뮤테이션 */
  const joinMutation = useJoinUserMutation();

  /** 로그인 뮤테이션 */
  const loginMutation = useLoginUserMutation();

  /** 아이디 중복 체크 진행중 상태 */
  const [isDuplicateIdChecking, setIsDuplicateIdChecking] = useState(false);

  /** 아이디 중복 체크 결과 상태 */
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);

  /** 회원가입 핸들러 */
  const handleJoin = async (params: JoinUserRequest, onSuccess?: () => void) => {
    await joinMutation.mutateAsync(params);
    toast.success('가입 되었습니다.');
    onSuccess?.();
  };

  /** 로그인 핸들러 */
  const handleLogin = async (params: LoginUserRequest) => {
    const token = await loginMutation.mutateAsync(params);
    dispatch(authInsert(token));
    toast.success('로그인 되었습니다.');
  };

  /** 아이디 중복 체크 핸들러 */
  const handleDuplicateIdCheck = async (params: DuplicateIdCheckUserRequest) => {
    if (!params.userId) {
      toast.error('아이디를 입력해주세요.');
    }

    if (isDuplicateIdChecking) {
      toast.error('이미 중복 체크를 진행중입니다.');
      return;
    }

    setIsDuplicateIdChecking(true);
    try {
      const data = await fetchIdDuplicateCheck(params.userId);

      if (typeof data === 'boolean') {
        if (data) {
          toast.error('중복된 아이디가 존재합니다');
        } else {
          toast.success('가입 가능한 아이디입니다.');
        }
        setIsIdAvailable(!data);
      }
      return;
    } finally {
      setIsDuplicateIdChecking(false);
    }
  };

  return {
    join: handleJoin,
    login: handleLogin,
    duplicateIdCheck: handleDuplicateIdCheck,
    isDuplicateIdChecking,
    isIdAvailable,
    setIsIdAvailable,
    joinMutation,
    loginMutation,
  };
};

export default useAuth;
