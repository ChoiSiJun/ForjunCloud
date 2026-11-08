import { useIsMutating } from 'react-query';

import LoadingOverlay from '@common/ui/atoms/feedback/LoadingOverlay';

const GlobalMutationLoading = () => {
  const mutationCount = useIsMutating();
  return mutationCount > 0 ? <LoadingOverlay label="변경사항을 저장하는 중" /> : null;
};

export default GlobalMutationLoading;
