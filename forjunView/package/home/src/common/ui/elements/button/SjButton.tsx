import { styled } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { useAppSelector } from 'store/ReduxHooks';

type ButtonType =
  | 'submit' // 폼 제출용
  | 'default' // 기본
  | 'confirm' // 확인
  | 'cancel' // 취소
  | 'create' // 생성
  | 'delete' // 삭제
  | 'input' // 리스트 추가
  | 'etc'; // 그 외 (outlined)

// 💡 Mui ButtonProps를 확장합니다.
interface SjButtonProps extends ButtonProps {
  ButtonType: ButtonType;
  buttonName: string;
  displayRule?: string;
}

// -----------------------------------------------------
// 💡 ButtonStyled에 공통 스타일을 통합하여 sx 반복을 제거했습니다.
const ButtonStyled = styled(Button)({
  minWidth: '80px',
  margin: '8px',
});
// -----------------------------------------------------

const SjButton = ({
  ButtonType = 'default',
  buttonName,
  displayRule = 'GUEST',
  size = 'small',
  onClick,
  ...rest
}: SjButtonProps) => {
  const role = useAppSelector(state => state.Auth.role);

  // 1. 권한 체크
  if (displayRule !== 'GUEST' && displayRule !== role) {
    return null;
  }

  // 2. ButtonType에 따라 달라지는 속성만 설정
  let variant: ButtonProps['variant'] = 'contained';
  let color: ButtonProps['color'] = 'primary';
  let sx: ButtonProps['sx'] = { ml: 'auto' }; // ml: 'auto'는 필요하다면 유지 (Grid 정렬에 영향)
  let type: 'submit' | 'button' = 'button';

  switch (ButtonType) {
    case 'submit':
      type = 'submit';
      break;
    case 'default':
    case 'confirm':
      break;

    case 'cancel':
      sx = { ...sx, backgroundColor: 'red' };
      break;

    case 'create':
      color = 'success';
      break;

    case 'delete':
      color = 'error';
      break;

    case 'input':
      variant = 'outlined';
      color = 'primary';
      // 💡 input 타입에 맞는 컴팩트한 스타일은 sx로 오버라이드합니다.
      sx = {
        minWidth: 0,
        padding: '6px 12px',
        margin: 0, // 이미 styled에 8px이 있다면, 0으로 덮어씁니다.
        lineHeight: 1,
        boxShadow: 'none',
      };
      break;

    case 'etc':
      variant = 'outlined';
      break;

    default:
      break;
  }

  // 3. ButtonStyled를 한 번만 렌더링
  return (
    <ButtonStyled
      // HTML type 속성
      type={type}
      // 설정된 스타일 및 속성
      variant={variant}
      color={color}
      size={size} // 💡 const로 선언된 size 사용
      sx={sx}
      // onClick 및 나머지 Props 전달
      onClick={onClick}
      {...rest}
    >
      {buttonName}
    </ButtonStyled>
  );
};

export default SjButton;
