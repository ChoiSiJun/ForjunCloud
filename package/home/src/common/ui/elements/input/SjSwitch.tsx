import { FormControlLabel, Switch, styled } from '@mui/material';

export const SjSwitchGuide = {
  title: '스위치',
  code: `<MirCheckbox label="라벨값" />`,
  requireNote: [],
  optionNote: [
    'label: 스위치 라벨',
    'required : 라벨사용시 -> 필수값 체크 표시',
    'defaultChecked : 기본값 체크',
    'disabled : 스위치 비활성화',
    'color: 스위치 컬러 ( secondary , warning , default)',
  ],
};

interface SjSwitchProps {
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  color?: 'secondary' | 'warning' | 'default';
  onChange?: () => void;
}

const SwitchStyled = styled(Switch)({});

const SjSwitch = ({
  label,
  defaultChecked = false,
  disabled = false,
  required = false,
  color,
  onChange,
}: SjSwitchProps) => {
  if (!label || label.trim() === '') {
    return (
      <SwitchStyled
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        onChange={onChange}
        color={color}
      />
    );
  } 
    return (
      <FormControlLabel
        label={label}
        control={
          <SwitchStyled
            defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            onChange={onChange}
            color={color}
          />
        }
      />
    );
  
};

export default SjSwitch;
