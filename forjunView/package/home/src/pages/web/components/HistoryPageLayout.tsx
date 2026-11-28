import React, { useState, useRef } from 'react';
import usePublicHistory from '@domain/history/hooks/usePublicHistory';
import useRecordPublicPageView from '@domain/pageview/hooks/useRecordPublicPageView';
import { useParams } from 'react-router-dom';
import HistoryItem from '@pages/web/components/HistoryItem';
import WepContentBox from '@pages/web/components/WebContentBox';
import TimelineSidebar from '@pages/web/components/HistorySidebar';
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
};

interface HistoryPageLayoutProps {
  category: 'RND' | 'SI' | 'SM' | 'TOY';
}

export const HistoryPageLayout: React.FC<HistoryPageLayoutProps> = ({ category }) => {
  const { userId } = useParams();
  const { data, isLoading, isError, isFetching, isFetchedAfterMount, refetch } = usePublicHistory({ category, userId });
  const historyList = data || [];
  useRecordPublicPageView(userId, category, isFetchedAfterMount && !isError && historyList.length > 0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  const scrollToItem = (id: number) => {
    setExpandedId(id);
  };

  if (isLoading || isError || historyList.length === 0) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100%', justifyContent: 'center', alignItems: 'center', p: 2 }}>
        {isLoading && <CircularProgress aria-label="경력 불러오는 중" />}
        {isError && (
          <Alert severity="error" action={<Button color="inherit" disabled={isFetching} onClick={() => refetch()}>다시 시도</Button>}>
            경력을 불러오지 못했습니다.
          </Alert>
        )}
        {!isLoading && !isError && (
          <Typography color="text.secondary">이 분류에 공개된 경력이 없습니다.</Typography>
        )}
      </Box>
    );
  }
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* 좌측 사이드바 */}
      <TimelineSidebar historyList={historyList.map(h => ({ id: Number(h.id), project: h.project }))} activeId={expandedId} onClick={scrollToItem} />

      {/* 우측 콘텐츠 영역 */}
      <WepContentBox color="#000" bgColor="#f0f2f5" ref={contentRef}>
        {historyList.map(history => (
          <HistoryItem key={history.id} id={`history-${history.id}`} history={history} expanded={expandedId === history.id} onToggle={toggleExpand} formatDate={formatDate} contentRef={contentRef} />
        ))}
      </WepContentBox>
    </div>
  );
};
