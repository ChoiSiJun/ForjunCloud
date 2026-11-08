import { Link, Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface SjTextProps extends TypographyProps {
  text: string;
  renderType?: 'title' | 'subtitle' | 'text' | 'link';
  onClick?: () => void;
}

// renderType을 prop으로 받아서 스타일링에 사용하려면 타입에 포함시켜야 함
interface StyledTypographyProps extends TypographyProps {
  renderType?: 'title' | 'subtitle' | 'text';
}

const StyledTypography = styled((props: StyledTypographyProps) => (
  <Typography {...props} />
))(({ theme, renderType }) => {
  switch (renderType) {
    case 'title':
      return {
        fontSize: theme.typography.h5.fontSize,
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.text.primary,
        marginBottom: 15,
      };
    case 'subtitle':
      return {
        fontSize: theme.typography.subtitle1.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
        color: theme.palette.text.secondary,
      };
    case 'text':
      return {
        fontSize: theme.typography.body1.fontSize,
        fontWeight: theme.typography.fontWeightRegular,
        color: theme.palette.text.primary,
      };
    default:
      return {};
  }
});

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: theme.typography.body1.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.primary.main,
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const SjText = ({
  text,
  variant = 'body1',
  renderType = 'text',
  onClick,
  ...rest
}: SjTextProps) => {
  if (renderType === 'link') {
    return <StyledLink onClick={onClick}>{text}</StyledLink>;
  }

  if (renderType === 'title' || renderType === 'subtitle') {
    return (
      <StyledTypography
        variant={variant}
        component="p"
        renderType={renderType} // 여기서 넘겨줌
        onClick={onClick}
        {...rest}
      >
        {text}
      </StyledTypography>
    );
  }
  return (
    <StyledTypography
      variant={variant}
      component="span"
      renderType={renderType} // 여기서 넘겨줌
      onClick={onClick}
      {...rest}
    >
      {text}
    </StyledTypography>
  );
};

export default SjText;
