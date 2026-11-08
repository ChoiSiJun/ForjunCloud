import { ListItemButton } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface SjListProps {
  renderType: '1';
  dataList: { primary: string; secondary: string }[]; // 각 항목의 'primary'와 'secondary' 값을 가질 수 있도록 설정
  handleClick?: (index: number) => void;
}

export default function SjList({
  renderType = '1',
  dataList,
  handleClick,
}: SjListProps) {
  // renderType이 '1'일 경우에만 리스트를 렌더링
  if (renderType === '1') {
    return (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {dataList.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton
              key={index}
              component="button"
              onClick={() => handleClick?.(index)}
            >
              <ListItemText primary={item.primary} secondary={item.secondary} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }

  return null; // renderType이 '1'이 아닌 경우, null을 반환
}
