import { ToastContainer, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ReactToastProps {
  // 알람 위치 지정
  position?:
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center';

  // 자동 off 시간
  autoClose?: number;

  // 진행 시간 바 숨김
  hideProgressBar?: boolean;

  // 새로운 알람 위치 설정
  newestOnTop?: boolean;

  // 클릭으로 알람 off
  closeOnClick?: boolean;

  // 알람 개수 제한
  limit?: number;

  // 알람 좌우 반전
  rtl?: boolean;

  // 화면 벗어나면 알람 정지
  pauseOnFocusLoss?: boolean;

  // 드래그 가능
  draggable?: boolean;

  // 마우스 올리면 알람 정지
  pauseOnHover?: boolean;

  // 테마
  theme?: 'dark' | 'light' | 'colored';

  // 알람 애니메이션 지정
  transition?: typeof Bounce | typeof Slide | typeof Zoom | typeof Flip;
}

function ReactToast({
  position = 'bottom-right',
  autoClose = 4000,
  hideProgressBar = false,
  newestOnTop = false,
  closeOnClick = false,
  limit = 3,
  rtl = false,
  pauseOnFocusLoss = false,
  draggable = false,
  pauseOnHover = false,
  theme = 'dark',
  transition = Bounce,
}: ReactToastProps) {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      limit={limit}
      rtl={rtl}
      pauseOnFocusLoss={pauseOnFocusLoss}
      draggable={draggable}
      pauseOnHover={pauseOnHover}
      theme={theme}
      transition={transition}
    />
  );
}

export default ReactToast;
