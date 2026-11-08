// 📁 SjCard.tsx

import { Card, CardContent, CardHeader, CardActions, SxProps, Theme } from '@mui/material';
import React from 'react';

export interface SjCardProps {
  /** 카드 제목 */
  title?: string;
  /** 카드 부제목 */
  subheader?: string;
  /** 카드 내용 */
  children: React.ReactNode;
  /** 카드 하단 액션 버튼 영역 */
  actions?: React.ReactNode;
  /** 카드 클릭 핸들러 */
  onClick?: () => void;
  /** 카드 높이 */
  height?: string | number;
  /** 카드 너비 */
  width?: string | number;
  /** 카드 배경색 */
  backgroundColor?: string;
  /** 카드 그림자 레벨 (0-24) */
  elevation?: number;
  /** 커스텀 스타일 */
  sx?: SxProps<Theme>;
  /** 카드 헤더 커스텀 스타일 */
  headerSx?: SxProps<Theme>;
  /** 카드 컨텐츠 커스텀 스타일 */
  contentSx?: SxProps<Theme>;
}

/**
 * @description 재사용 가능한 카드 컴포넌트
 * 제목, 내용, 액션 버튼을 포함한 카드 레이아웃을 제공합니다.
 */
const SjCard = ({
  title,
  subheader,
  children,
  actions,
  onClick,
  height,
  width,
  backgroundColor,
  elevation = 1,
  sx,
  headerSx,
  contentSx,
}: SjCardProps) => {
  return (
    <Card
      elevation={elevation}
      onClick={onClick}
      sx={{
        height,
        width,
        backgroundColor: backgroundColor || 'background.paper',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              boxShadow: 4,
              transform: 'translateY(-2px)',
            }
          : {},
        ...sx,
      }}
    >
      {(title || subheader) && (
        <CardHeader
          title={title}
          subheader={subheader}
          sx={{
            pb: subheader ? 1 : 0,
            ...headerSx,
          }}
        />
      )}
      <CardContent
        sx={{
          pt: !title && !subheader ? 2 : 0,
          ...contentSx,
        }}
      >
        {children}
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
};

export default SjCard;




