// TimelineSidebar.tsx
import { Box, Typography } from '@mui/material';

interface TimelineSidebarProps {
  historyList: { id: number; project: string; year?: string }[];
  activeId: number | null;
  onClick: (id: number) => void;
}

const TimelineSidebar = ({
  historyList,
  activeId,
  onClick,
}: TimelineSidebarProps) => {
  return (
    <Box
      sx={{
        width: 220,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {historyList.map((item, index) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            mb: index !== historyList.length - 1 ? 3 : 0,
          }}
          onClick={() => onClick(item.id)}
        >
          {/* Dot */}
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: activeId === item.id ? '#1976d2' : '#ccc',
              mr: 1.5,
            }}
          />
          {/* Project name */}
          <Typography
            variant="body2"
            sx={{
              color: activeId === item.id ? '#1976d2' : '#555',
              fontWeight: activeId === item.id ? 600 : 400,
            }}
          >
            {item.project}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TimelineSidebar;
