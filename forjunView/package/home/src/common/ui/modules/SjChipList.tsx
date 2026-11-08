// 📁 SjChipList.tsx

import { Box, Chip } from '@mui/material';

interface SjChipListProps {
  /** 칩에 표시할 문자열 배열 */
  dataList: string[];
  onDelete: (index: number) => void;
}

/**
 * @description 재사용 가능한 Chip 목록 컴포넌트
 */
const SjChipList = ({ dataList, onDelete }: SjChipListProps) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
      {dataList.map((item, idx) => (
        <Chip key={idx} label={item} onDelete={() => onDelete(idx)} />
      ))}
    </Box>
  );
};

export default SjChipList;
