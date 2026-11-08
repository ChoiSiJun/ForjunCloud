import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

interface SjDatePickerProps {
  label: string;
  initialDate?: Dayjs | null; // 초기값 (optional)
  onDateChange?: (value: Dayjs | null) => void;
}

const SjDatePicker = ({ label, onDateChange, initialDate = null }: SjDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(initialDate);

  useEffect(() => {
    setSelectedDate(initialDate);
  }, [initialDate]);

  const handleChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    if (onDateChange) {
      onDateChange(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker name="" label={label} value={selectedDate} onChange={handleChange} format="YYYY-MM-DD" slotProps={{ textField: { fullWidth: true } }} />
    </LocalizationProvider>
  );
};

export default SjDatePicker;
