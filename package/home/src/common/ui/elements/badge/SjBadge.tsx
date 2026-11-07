// 📁 SjBadge.tsx

import { Badge, BadgeProps, SxProps, Theme } from '@mui/material';
import React from 'react';

export type BadgeVariant = 'standard' | 'dot';
export type BadgeColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

export interface SjBadgeProps extends Omit<BadgeProps, 'badgeContent' | 'color' | 'variant'> {
  /** 배지에 표시할 내용 (숫자, 텍스트 등) */
  badgeContent?: React.ReactNode;
  /** 배지 색상 */
  badgeColor?: BadgeColor;
  /** 배지 스타일 (standard: 숫자/텍스트, dot: 점) */
  badgeVariant?: BadgeVariant;
  /** 배지가 표시될 자식 요소 */
  children: React.ReactNode;
  /** 배지 최대값 (숫자일 경우) */
  max?: number;
  /** 배지가 보이는지 여부 */
  invisible?: boolean;
  /** 배지 위치 오프셋 */
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'right' | 'left';
  };
  /** 커스텀 스타일 */
  sx?: SxProps<Theme>;
  /** 배지 커스텀 스타일 */
  badgeSx?: SxProps<Theme>;
}

/**
 * @description 재사용 가능한 배지 컴포넌트
 * 알림, 상태, 카운트 등을 표시하는 배지 컴포넌트입니다.
 */
const SjBadge = ({
  badgeContent,
  badgeColor = 'error',
  badgeVariant = 'standard',
  children,
  max = 99,
  invisible = false,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  sx,
  badgeSx,
  ...rest
}: SjBadgeProps) => {
  // sx와 badgeSx를 병합하여 Badge의 sx prop에 전달
  const mergedSx = React.useMemo(() => {
    if (!badgeSx) return sx;

    const baseSx = Array.isArray(sx) ? sx : [sx].filter(Boolean);

    return [
      ...baseSx,
      {
        '& .MuiBadge-badge': badgeSx,
      },
    ];
  }, [sx, badgeSx]);

  return (
    <Badge badgeContent={badgeContent} color={badgeColor} variant={badgeVariant} max={max} invisible={invisible} anchorOrigin={anchorOrigin} sx={mergedSx} {...rest}>
      {children}
    </Badge>
  );
};

export default SjBadge;
