import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

interface CopyrightProps {
  color: string;
  href: string;
}

// 하단 카피라이트 컴포넌트
function Copyright({ color, href }: CopyrightProps) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" pt={4}>
      {'Copyright © '}
      <Link color={color} href={href}>
        MirTech.
      </Link>{' '}
      {new Date().getFullYear()}
      .
    </Typography>
  );
}

const Footer = () => {
  return <Copyright color="inherit" href="https://mirtech.co.kr/" />;
};

export default Footer;
