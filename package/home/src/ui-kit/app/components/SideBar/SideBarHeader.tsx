import { Link } from 'react-router-dom';
import { Box, Typography, styled, useTheme, Popover, MenuItem, MenuList, alpha } from '@mui/material';

import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AppsIcon from '@mui/icons-material/Apps';
import React, { useState } from 'react';
import packageInfo from '@config/Menu/Package';
import { useAppDispatch, useAppSelector } from 'store/ReduxHooks';
import { packageAccess } from 'store/slice/MenuSlice';
import forjunlogo from "../../asset/forjuncloud-logo.svg";

//* *************************컴포넌트 스타일 재설정
// Link 스타일 컴포넌트 재정의
const LinkStyled = styled(Link)(() => ({
  height: '90px',
  width: '180px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.2s ease',
  padding: '8px',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  '& img': {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  },
}));

// 모듈변경 버튼 컴포넌트 재정의 (세련된 카드 스타일)
const ModuleChangeBox = styled(Button)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '12px',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
  padding: '12px 16px',
  width: '100%',
  color: theme.palette.text.primary,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.9)} 100%)`,
    color: '#ffffff',
    borderColor: theme.palette.primary.main,
    boxShadow: '0 4px 16px rgba(33, 67, 143, 0.3)',
    transform: 'translateY(-1px)',
    '& .package-icon-box': {
      backgroundColor: alpha('#ffffff', 0.2),
      background: `linear-gradient(135deg, ${alpha('#ffffff', 0.25)} 0%, ${alpha('#ffffff', 0.15)} 100%)`,
    },
    '& .package-icon': {
      color: '#ffffff',
    },
    '& .package-label': {
      color: alpha('#ffffff', 0.9),
    },
    '& .package-name': {
      color: '#ffffff',
    },
    '& .package-arrow': {
      color: '#ffffff',
    },
  },
}));

// 아이콘과 텍스트 묶음
const BoxSetWrap = styled(Box)(() => ({
  margin: 0,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
}));

// 아이콘 박스 (더 세련된 디자인)
const MaterialIconBox = styled(Box)(({ theme }) => ({
  width: '44px',
  height: '44px',
  borderRadius: '10px',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
  color: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.3s ease',
  flexShrink: 0,
}));

const SideBarHeader = () => {
  //* *************************컴포넌트 구성에 필요한 값들 설정

  const theme = useTheme();
  const dispatch = useAppDispatch();
  const packageIndex = useAppSelector(state => state.Menu.accessPackageIndex);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handlePackageItemClick = (index: number) => {
    setAnchorEl(null);
    dispatch(packageAccess(index));
  };

  // 패키지 선택박스 제어
  const moduleSelectBox = Boolean(anchorEl);

  //* ******************************컴포넌트 이벤트 정의

  // 패키지 선택박스 열기 이벤트
  const handlePackageSelectOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 패키지 선택박스 닫힘 이벤트
  const handlePackageSelectClose = () => {
    setAnchorEl(null);
  };

  //* ***********************컴포넌트 렌더링 */
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2.5,
      }}
    >
      {/* 로고 영역 */}
      <LinkStyled
        to="/liberty/dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={forjunlogo} alt="Logo" style={{ width: '100%', height: 'auto', maxWidth: '180px' }} />
      </LinkStyled>

      {/* 패키지 선택 영역 */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 1 }}>
        <ModuleChangeBox
          onClick={handlePackageSelectOpen}
          fullWidth
          endIcon={
            <ArrowDropDownIcon
              className="package-arrow"
              sx={{
                transition: 'transform 0.3s ease, color 0.3s ease',
                transform: moduleSelectBox ? 'rotate(180deg)' : 'rotate(0deg)',
                color: 'inherit',
                flexShrink: 0,
              }}
            />
          }
        >
          <BoxSetWrap sx={{ flex: 1, minWidth: 0 }}>
            <MaterialIconBox className="package-icon-box">
              <AppsIcon className="package-icon" sx={{ fontSize: '20px' }} />
            </MaterialIconBox>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start', 
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <Typography
                className="package-label"
                variant="caption"
                sx={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'text.secondary',
                  lineHeight: 1.2,
                  mb: 0.25,
                  transition: 'color 0.3s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
              >
                Package
              </Typography>
              <Typography
                className="package-name"
                variant="body2"
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  transition: 'color 0.3s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
              >
                {packageInfo[packageIndex].packageName}
              </Typography>
            </Box>
          </BoxSetWrap>
        </ModuleChangeBox>

        <Popover
          id="packageSelectPopOver"
          open={moduleSelectBox}
          anchorEl={anchorEl}
          onClose={handlePackageSelectClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              marginTop: '8px',
              overflow: 'hidden',
            },
          }}
        >
          <MenuList
            id="split-button-menu"
            autoFocusItem
            sx={{
              py: 0.5,
              '& .MuiMenuItem-root': {
                borderRadius: '8px',
                mx: 0.5,
                my: 0.25,
                px: 2,
                py: 1.25,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.16),
                  },
                },
              },
            }}
          >
            {packageInfo.map((item, index) => (
              <MenuItem
                key={item.packageCode}
                selected={index === packageIndex}
                onClick={() => handlePackageItemClick(index)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: index === packageIndex ? theme.palette.primary.main : 'transparent',
                      border: `2px solid ${index === packageIndex ? theme.palette.primary.main : theme.palette.divider}`,
                      transition: 'all 0.2s ease',
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: index === packageIndex ? 600 : 400 }}>
                    {item.packageName}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </MenuList>
        </Popover>
      </Box>
    </Box>
  );
};

export default SideBarHeader;
