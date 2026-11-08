import { useDeleteHistoryMutation } from '@domain/history/api/useDeleteHistoryMutation';
import { useInsertHistoryMutation } from '@domain/history/api/useInsertHistoryMutation';
import { useUpdateHistoryMutation } from '@domain/history/api/useUpdateHistoryMutation';
import { useHistoryListQuery } from '@domain/history/api/useHistoyListQuery';
import { HISTORY_API_ENDPOINTS } from '@domain/history/api/HistoryApi';
import { GetRequestType } from '@common/utill/type-utils';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { modalClose } from '@store/slice/ModalSlice';
import { useAppDispatch } from '@store/ReduxHooks';

const useHistory = (category: 'SI' | 'SM' | 'RND' | 'TOY') => {
  /** Types */
  type HistorySaveRequest = GetRequestType<typeof HISTORY_API_ENDPOINTS.save>;
  type HistoryUpdateRequest = GetRequestType<typeof HISTORY_API_ENDPOINTS.update>;
  type HistoryDeleteRequest = GetRequestType<typeof HISTORY_API_ENDPOINTS.delete>;

  /** Mutation & Query */
  const queryClient = useQueryClient();
  const getHistoryList = useHistoryListQuery({ category }).data;
  const insertHistory = useInsertHistoryMutation().mutateAsync;
  const updateHistory = useUpdateHistoryMutation().mutateAsync;
  const deleteHistory = useDeleteHistoryMutation().mutateAsync;

  /** Redux */
  const dispatch = useAppDispatch();

  /** 핸들러 */

  /** 등록 핸들러 */
  const handleInsertHistory = async (params: HistorySaveRequest) => {
    await insertHistory(params);
    queryClient.invalidateQueries(['history', category]);
    toast.success('History 등록되었습니다.');
    dispatch(modalClose());
  };

  /** 수정 핸들러 */
  const handleUpdateHistory = async (params: HistoryUpdateRequest) => {
    await updateHistory(params);
    queryClient.invalidateQueries(['history', category]);
    toast.success('History 수정되었습니다.');
    dispatch(modalClose());
  };

  /** 삭제 핸들러 */
  const handleDeleteHistory = async (params: HistoryDeleteRequest) => {
    await deleteHistory(params);
    queryClient.invalidateQueries(['history', category]);
    toast.success('History 삭제되었습니다.');
  };

  /** 날짜 포맷팅 */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  };

  return {
    historyList: getHistoryList || [],
    insertHistory: handleInsertHistory,
    updateHistory: handleUpdateHistory,
    deleteHistory: handleDeleteHistory,
    formatDate,
  };
};

export default useHistory;
