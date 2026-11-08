import { styled, keyframes } from '@mui/system';

const blink = keyframes`
  0% {
    box-shadow: 10px 0 rgba(255, 255, 255, 0), 20px 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 10px 0 white, 20px 0 rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 10px 0 white, 20px 0 white;
  }
`;

const LoaderContainer = styled('span')({
  color: 'dark',
  display: 'inline-block',
  position: 'relative',
  fontSize: '48px',
  fontFamily: 'Arial, Helvetica, sans-serif',
  boxSizing: 'border-box',

  '&::after': {
    content: '""',
    width: '5px',
    height: '5px',
    background: 'currentColor',
    position: 'absolute',
    bottom: '10px',
    right: '-5px',
    boxSizing: 'border-box',
    animation: `${blink} 1s linear infinite`,
  },
});

const Loading = () => {
  return <LoaderContainer>Loading</LoaderContainer>;
};

export default Loading;
