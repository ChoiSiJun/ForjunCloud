// mui imports
import {
  ListItemIcon,
  ListItemButton,
  ListItem,
  styled,
  ListItemText,
} from '@mui/material';

import { Link } from 'react-router-dom';

import ArticleIcon from '@mui/icons-material/Article';

// 타입지정
interface NavItemProps {
  name: string;
  path: string;
  code: string;
  accessPath: string;
  onClick?: () => void;
}

// 스타일 컴포넌트 재구성
const NavItemStyled = styled(ListItemButton)(({ theme }) => ({
  whiteSpace: 'nowrap',
  marginBottom: '4px',
  padding: '10px 14px',
  borderRadius: '10px',
  color: theme.palette.text.secondary,
  paddingLeft: '14px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '3px',
    height: 0,
    borderRadius: '0 3px 3px 0',
    backgroundColor: theme.palette.primary.main,
    transition: 'height 0.2s ease',
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
    transform: 'translateX(2px)',
    '&::before': {
      height: '60%',
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
      transform: 'scale(1.1)',
    },
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    fontWeight: 600,
    '&::before': {
      height: '70%',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      transform: 'translateX(2px)',
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
}));

const NavItem = ({ name, path, code, accessPath, onClick }: NavItemProps) => {
  // 컴포넌트 렌더링
  return (
    <ListItem component="li" disablePadding key={code}>
      <Link
        to={path}
        style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
      >
        <NavItemStyled
          onClick={onClick}
          selected={accessPath === path}
          sx={{ width: '100%' }}
        >
          <ListItemIcon
            sx={{
              minWidth: '40px',
              p: '3px 0',
              color: 'inherit',
              transition: 'all 0.2s ease',
            }}
          >
            <ArticleIcon sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          <ListItemText sx={{ width: '100%' }}>
            {name}
          </ListItemText>
        </NavItemStyled>
      </Link>
    </ListItem>
  );
};

export default NavItem;
