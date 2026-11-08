import { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SjButton from '../elements/button/SjButton';
import SjTextField from '../elements/input/SjTextField';

interface SjInputListProps {
  label: string;
  name: string;
  listHeight?: number;
  onChangeList: (updateList: string[]) => void;
  initialList?: string[]; // 추가: 기존 값 초기화용
}

const SjInputList = ({
  label,
  name,
  onChangeList,
  listHeight = 150,
  initialList = [], // 기본값 빈 배열
}: SjInputListProps) => {
  const [valueList, setValueList] = useState<string[]>(initialList); // 초기값 적용
  const [value, setValue] = useState<string>('');

  // initialList가 변경되면 valueList 업데이트
  useEffect(() => {
    setValueList(initialList);
  }, [initialList]);

  useEffect(() => {
    onChangeList(valueList);
  }, [valueList, onChangeList]);

  const addvalue = () => {
    if (value.trim() === '') return;
    setValueList([...valueList, value]);
    setValue('');
  };

  const removevalue = (removeIdx: number) => {
    setValueList(valueList.filter((_, idx) => idx !== removeIdx));
  };

  return (
    <Box>
      <SjTextField
        label={label}
        name={name}
        value={value}
        onChange={event => setValue(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" onClick={addvalue} size="small">
                <SjButton
                  ButtonType="input"
                  buttonName="추가"
                  onClick={addvalue}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <List
        sx={{
          mt: 1,
          height: listHeight,
          maxHeight: listHeight,
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: 1,
        }}
      >
        {valueList.map((n, idx) => (
          <ListItem key={idx} divider>
            <ListItemText primary={n} />
            <SjButton
              ButtonType="input"
              buttonName="삭제"
              onClick={() => removevalue(idx)}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SjInputList;
