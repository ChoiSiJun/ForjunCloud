import { SxProps, Theme } from '@mui/material';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';

export interface SjTextFieldProps {
  label: string;
  name?: string;
  id?: string;
  type?: string;
  value?: string | number;
  textFieldType?: 'outlined-basic' | 'filled-basic' | 'standard-basic';
  InputRef?: React.RefObject<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string | undefined;
  InputProps?: TextFieldProps['InputProps'];
  size?: 'small' | 'medium';
  sx?: SxProps<Theme> | undefined;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

const SjTextField = ({
  label,
  name,
  id,
  type,
  value,
  textFieldType = 'outlined-basic',
  InputProps,
  InputRef,
  onChange,
  onBlur,
  onKeyDown,
  error,
  size = 'small',
  sx,
  helperText,
  multiline,
  rows,
  placeholder,
}: SjTextFieldProps) => {
  // textFieldType을 MUI variant로 변환
  const getVariant = (): 'outlined' | 'filled' | 'standard' => {
    if (textFieldType === 'filled-basic') return 'filled';
    if (textFieldType === 'standard-basic') return 'standard';
    return 'outlined'; // 기본값은 outlined
  };

  // id는 prop으로 받거나 name을 사용하거나 자동 생성
  const fieldId = id || name || `sj-textfield-${label}`;

  return (
    <MuiTextField
      id={fieldId}
      name={name}
      type={type}
      label={label}
      variant={getVariant()}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      error={error}
      value={value}
      helperText={helperText}
      InputProps={InputProps}
      inputRef={InputRef}
      size={size}
      fullWidth
      sx={sx}
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
    />
  );
};

export default SjTextField;
