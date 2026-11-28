export interface User {
  id: number;
  userId: string;
  password: string;
  userName: string;
  email: string;
  authority: string;
  historyPrivate: string;
  personalPrivate: string;
}

export const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
export const passwordRequirements = '비밀번호는 최소 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.';
