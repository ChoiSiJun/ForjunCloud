import { Box, Typography, Stack, Chip, Collapse, Divider } from '@mui/material';
import { Viewer } from '@toast-ui/react-editor';
import { RefObject } from 'react';

interface HistoryItemProps {
  id?: string;
  history: {
    id: number;
    project: string;
    historyStartDate: string;
    historyEndDate: string;
    subject: string;
    historySkill: string[];
    description?: string;
  };
  expanded: boolean;
  onToggle: (id: number) => void;
  formatDate: (date: string) => string;
  contentRef?: RefObject<HTMLDivElement>; // 중앙 스크롤용
}

const HistoryItem = ({ id, history, expanded, onToggle, formatDate, contentRef }: HistoryItemProps) => {
  // Collapse가 열렸을 때 중앙 스크롤
  const handleCollapseEntered = () => {
    if (id && contentRef?.current) {
      const container = contentRef.current;
      const item = document.getElementById(id);
      if (item) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const scrollTop = container.scrollTop + itemRect.top - containerRect.top - containerRect.height / 2 + itemRect.height / 2;
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }
    }
  };

  return (
    <Box
      id={id}
      onClick={() => onToggle(history.id)}
      sx={{
        scrollSnapAlign: 'center',
        width: expanded ? '100%' : { xs: '90%', sm: '70%', md: '50%' },
        minHeight: expanded ? 'calc(100vh - 64px)' : 300,
        maxHeight: expanded ? 'calc(100vh - 64px)' : 'none',
        px: expanded ? 6 : 3,
        py: expanded ? 6 : 4,
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: expanded ? 'flex-start' : 'center',
        alignItems: 'center',
        bgcolor: expanded ? '#ffffff' : '#f8f9fa',
        borderRadius: expanded ? 0 : 3,
        boxShadow: expanded ? '0 0 0 rgba(0,0,0,0)' : '0 6px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        overflowY: expanded ? 'auto' : 'hidden',
        overflowX: 'hidden',
      }}
    >
      {/* 헤더 */}
      <Typography variant="h4" sx={{ mb: 1 }}>
        {history.project}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
        {formatDate(history.historyStartDate)} ~ {formatDate(history.historyEndDate)}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        {history.subject}
      </Typography>

      {/* 상세 내용 */}
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        onEntered={handleCollapseEntered} // 중앙 스크롤
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-start" sx={{ mb: 2 }}>
          {history.historySkill.map(skill => (
            <Chip key={skill} label={skill} color="primary" />
          ))}
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          <Viewer initialValue={history.description || '설명이 없습니다.'} />
        </Typography>
      </Collapse>
    </Box>
  );
};

export default HistoryItem;
