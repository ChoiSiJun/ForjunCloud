import React, { useState, useRef } from 'react';
import { useWebHistoryListQuery } from '@domain/history/api/useWebHistoyQuery';
import { useParams } from 'react-router-dom';
import HistoryItem from '@pages/web/components/HistoryItem';
import WepContentBox from '@pages/web/components/WebContentBox';
import TimelineSidebar from '@pages/web/components/HistorySidebar';
import { Box } from '@mui/material';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
};

interface HistoryPageLayoutProps {
  category: 'RND' | 'SI' | 'SM' | 'TOY';
}

export const HistoryPageLayout: React.FC<HistoryPageLayoutProps> = ({ category }) => {
  const { userId } = useParams();
  const historyList = useWebHistoryListQuery({ category, userId }).data || [];
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: number) => setExpandedId(prev => (prev === id ? null : id));

  const scrollToItem = (id: number) => {
    setExpandedId(id);
  };

  if (historyList.length === 0) {
    return <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>No history found</Box>;
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
