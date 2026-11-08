import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface SjSelectBoxMenuItem {
  name: string;
  value: string;
}

interface SjSelectBoxProps {
  menuItem: SjSelectBoxMenuItem[];
  defaultValue: string;
  label: string;
  layout?: undefined | 'standard' | 'outlined' | 'filled';
  inputRef?: React.RefObject<HTMLInputElement>;
  name: string | undefined;
  onChange?: (event: SelectChangeEvent) => void; //
}

const SjSelectBox = ({ layout = undefined, menuItem, defaultValue, label, onChange, inputRef, name }: SjSelectBoxProps) => {
  return (
    <FormControl variant={layout} fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select labelId={`${label  }_labelid`} id={`${label  }_id`} value={defaultValue} label={label} name={name} inputRef={inputRef} onChange={onChange}>
        {menuItem.map(item => (
          <MenuItem value={item.value} selected={defaultValue === item.value} key={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SjSelectBox;
