import { ListSubheader, styled, alpha } from '@mui/material';

interface NavGroupProps {
  name: string;
}

// 스타일 컴포넌트 재구성
const ListSubheaderStyled = styled(ListSubheader)(({ theme }) => ({
  ...theme.typography.subtitle2,
  fontWeight: 600,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  lineHeight: '20px',
  padding: '8px 16px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontSize: '11px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: alpha(theme.palette.primary.main, 0.4),
  },
}));

// 렌더링
const NavGroup = ({ name }: NavGroupProps) => {
  return <ListSubheaderStyled disableSticky>{name}</ListSubheaderStyled>;
};

export default NavGroup;
