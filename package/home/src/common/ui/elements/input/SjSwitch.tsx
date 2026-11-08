import { FormControlLabel, Switch, styled } from '@mui/material';

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
