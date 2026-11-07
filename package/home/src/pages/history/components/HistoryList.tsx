import SjButton from '@common/ui/elements/button/SjButton';
import SjText from '@common/ui/elements/text/SjText';
import { Box, Card, CardContent, Chip, Collapse, Divider, Stack, Typography } from '@mui/material';
import { useAppDispatch } from '@store/ReduxHooks';
import { confirmDialogOpen } from '@store/slice/ConfirmDialogSlice';
import { modalOpen } from '@store/slice/ModalSlice';
import useHistory from '@domain/history/hooks/useHistory';
import { useState } from 'react';
import Register from '@domain/history/components/Register';
import '@toast-ui/editor/dist/toastui-editor-viewer.css'; // 뷰어 전용 CSS
import { Viewer } from '@toast-ui/react-editor';

interface HistoryListProps {
  category: 'SI' | 'SM' | 'RND' | 'TOY';
}

const HistoryList = ({ category }: HistoryListProps) => {
  /** Redux */
  const dispatch = useAppDispatch();

  /** Hook */
  const { historyList, insertHistory, updateHistory, deleteHistory, formatDate } = useHistory(category);

  /** 확장 상태 */
  const [expandedId, setExpandedId] = useState<number | null>(null);

  /** 등록 버튼 클릭 핸들러 */
  const openRegister = () => {
    dispatch(modalOpen(<Register onClick={insertHistory} catagory={category} />));
  };
  /** 수정 버튼 클릭 핸들러 */
  const openUpdate = (id: number) => {
    dispatch(modalOpen(<Register onClick={updateHistory} catagory={category} id={id} />));
  };

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };
  return (
    <Box
      p={2}
      sx={{
        maxWidth: '100vw',
        width: '100%',
        overflowX: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* 상단 제목 + 등록 버튼 영역 */}
      <Box
        mb={2}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SjText renderType="title" text={`${category} History`} />
        <SjButton ButtonType="input" buttonName="등록" onClick={openRegister} />
      </Box>

      {/* 구분선 */}
      <Divider sx={{ mb: 3 }} />

      {/* 리스트 */}
      {historyList?.map(history => (
        <Card
          key={history.id}
          sx={{
            mb: 2,
            borderRadius: 3,
            boxShadow: 3,
            width: '100%',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: 6,
            },
          }}
          onClick={() => toggleExpand(history.id)}
          elevation={expandedId === history.id ? 8 : 3}
          aria-expanded={expandedId === history.id}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleExpand(history.id);
            }
          }}
        >
          <Box textAlign="right" onClick={e => e.stopPropagation()}>
            <SjButton
              ButtonType="confirm"
              buttonName="수정"
              onClick={e => {
                e.stopPropagation();
                dispatch(
                  confirmDialogOpen({
                    title: '수정 확인',
                    message: '이 항목을 수정하시겠습니까?',
                    confirmText: '수정',
                    cancelText: '취소',
                    onConfirm: () => {
                      openUpdate(history.id);
                    },
                  }),
                );
              }}
            />
            <SjButton
              ButtonType="delete"
              buttonName="삭제"
              onClick={e => {
                e.stopPropagation();
                dispatch(
                  confirmDialogOpen({
                    title: '삭제 확인',
                    message: '정말로 이 항목을 삭제하시겠습니까?',
                    confirmText: '삭제',
                    cancelText: '취소',
                    onConfirm: () => {
                      deleteHistory({ id: history.id });
                    },
                  }),
                );
              }}
            />
          </Box>

          <CardContent
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
                flex: 1,
                minWidth: 0,
              }}
            >
              <SjText
                renderType="title"
                text={history.project}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />
              <SjText
                renderType="subtitle"
                text={history.subject}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'text.secondary',
                }}
              />
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: 'nowrap',
                flexShrink: 0,
                minWidth: '120px',
                textAlign: 'right',
              }}
            >
              {formatDate(history.historyStartDate)} ~ {formatDate(history.historyEndDate)}
            </Typography>
          </CardContent>

          <Collapse in={expandedId === history.id} timeout="auto" unmountOnExit>
            <Box
              sx={{
                px: 3,
                pb: 3,
                pt: 0,
                bgcolor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                width: '100%',
                maxWidth: '100vw',
                wordBreak: 'break-word',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.05)',
              }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 3, mb: 3 }}>
                {history.historySkill.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    size="medium"
                    variant="outlined"
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'primary.dark',
                      fontWeight: 'bold',
                    }}
                  />
                ))}
              </Stack>

              <Divider sx={{ mb: 2 }} />
              <Viewer initialValue={history.description || '설명이 없습니다.'} />
            </Box>
          </Collapse>
        </Card>
      ))}
    </Box>
  );
};

export default HistoryList;
