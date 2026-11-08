import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

interface SjRadioItemProps {
  label: string;
  value: string;
}

interface SjRadioProps {
  label: string;
  defaultValue: string;
  radioItem: SjRadioItemProps[];
  direction?: 'row' | 'column';
  onChange?: () => void;
}

const SjRadio = ({
  label,
  defaultValue,
  radioItem,
  direction,
  onChange,
}: SjRadioProps) => {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
      <RadioGroup
        row={direction === 'row'}
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={defaultValue}
        name="radio-buttons-group"
        onChange={onChange}
      >
        {radioItem.map(item => (
          <FormControlLabel
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default SjRadio;
