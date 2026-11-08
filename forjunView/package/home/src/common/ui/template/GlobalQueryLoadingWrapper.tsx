import { useIsFetching } from 'react-query';

import LoadingOverlay from '@common/ui/atoms/feedback/LoadingOverlay';

interface GlobalLoadingWrapperProps {
  children: React.ReactNode;
}

const GlobalQueryLoadingWrapper = ({ children }: GlobalLoadingWrapperProps) => {
  const fetchingCount = useIsFetching();

  return (
    <>
      {fetchingCount > 0 && <LoadingOverlay label="데이터를 불러오는 중" />}
      {children}
    </>
  );
};

export default GlobalQueryLoadingWrapper;
