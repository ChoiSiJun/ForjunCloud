import SjSelectBox from '@common/ui/elements/input/SjSelectBox';
import SjTextField from '@common/ui/elements/input/SjTextField';
import SjDatePicker from '@common/ui/modules/SjDatePicker';
import SjInputList from '@common/ui/modules/SjInputList';
import { Box, Button, Grid } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { HistorySaveRequest, HistoryUpdateRequest } from '@domain/history/api/HistoryApi';
import BoardEditor from '@common/ui/template/BoardEditor';
import useHistoryQuery from '@domain/history/api/useHistoryQuery';

interface RegisterProps<T> {
  onClick: (params: T) => void | Promise<void>;
  catagory: 'SI' | 'SM' | 'RND' | 'TOY';
  id?: number; // 수정 모드일 때 history id
}

const Register = <T extends HistorySaveRequest | HistoryUpdateRequest>({ onClick, catagory, id }: RegisterProps<T>) => {
  /** 상태 */
  const isEditMode = !!id && id > 0;
  const { data } = useHistoryQuery({ id: isEditMode ? id : 0 });
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [skillList, setSkillList] = useState<string[]>([]);

  /** Hook */
  const registerForm = useFormik<HistorySaveRequest | HistoryUpdateRequest>({
    initialValues: {
      ...(isEditMode && id ? { id } : {}),
      category: catagory,
      project: '',
      subject: '',
      description: '',
      historyStartDate: '',
      historyEndDate: '',
      historySkill: [],
    },

    validationSchema: Yup.object({
      category: Yup.string().required('유형선택은 필수입니다.'),
      project: Yup.string().required('프로젝트명은 필수입니다.'),
    }),

    onSubmit: async values => {
      const submitValues = { ...values };
      submitValues.description = description;
      onClick(submitValues as T);
    },
  });

  const { setFieldValue } = registerForm;

  // 수정 모드일 때 데이터가 로드되면 폼 값 업데이트
  useEffect(() => {
    if (isEditMode && data) {
      setFieldValue('id', data.id);
      setFieldValue('category', data.category);
      setFieldValue('project', data.project);
      setFieldValue('subject', data.subject);
      setFieldValue('description', data.description);
      setFieldValue('historyStartDate', dayjs(data.historyStartDate));
      setFieldValue('historyEndDate', dayjs(data.historyEndDate));
      setFieldValue('historySkill', data.historySkill || []);

      // 상태값도 업데이트
      setDescription(data.description || '');
      setStartDate(data.historyStartDate ? dayjs(data.historyStartDate) : null);
      setEndDate(data.historyEndDate ? dayjs(data.historyEndDate) : null);
      setSkillList(data.historySkill || []);
    }
  }, [isEditMode, data, setFieldValue]);

  const onChangeStartDate = (value: Dayjs | null) => {
    setStartDate(value);
    const historyStartDate = value?.format('YYYY-MM-DD');
    setFieldValue('historyStartDate', historyStartDate || '');
  };

  const onChangeEndDate = (value: Dayjs | null) => {
    setEndDate(value);
    const historyEndDate = value?.format('YYYY-MM-DD');
    setFieldValue('historyEndDate', historyEndDate || '');
  };

  const onChangeSkillList = useCallback(
    (valueList: string[]) => {
      setSkillList(valueList);
      setFieldValue('historySkill', valueList);
    },
    [setFieldValue],
  );

  return (
    <Box component="form" noValidate onSubmit={registerForm.handleSubmit}>
      <Grid container component="main" sx={{ height: '80vh' }}>
        <Grid item xs={12} sm={12} md={12} margin={1}>
          <SjSelectBox
            menuItem={[
              { name: 'SI', value: 'SI' },
              { name: 'SM', value: 'SM' },
              { name: 'RND', value: 'RND' },
              { name: 'TOY', value: 'TOY' },
            ]}
            defaultValue={registerForm.values.category}
            label="유형"
            name="category"
            onChange={registerForm.handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} margin={1}>
          <SjTextField label="프로젝트" name="project" value={registerForm.values.project} onChange={registerForm.handleChange} />
        </Grid>

        <Grid item xs={12} sm={12} md={12} margin={1}>
          <SjTextField label="주제" name="subject" value={registerForm.values.subject} onChange={registerForm.handleChange} />
        </Grid>

        <Grid item xs={12} sm={12} md={12} margin={1}>
          <SjDatePicker label="시작날짜" onDateChange={onChangeStartDate} initialDate={startDate} />
        </Grid>

        <Grid item xs={12} sm={12} md={12} margin={1}>
          <SjDatePicker label="종료날짜" onDateChange={onChangeEndDate} initialDate={endDate} />
        </Grid>

        <Grid item xs={12} sm={12} md={12} margin={1}>
          <SjInputList label="SKill" name="skill" listHeight={90} onChangeList={onChangeSkillList} initialList={skillList} />
        </Grid>

        <Grid item xs={12} sm={12} md={12} margin={1}>
          <BoardEditor value={description} setValue={setDescription} directory="history" />
        </Grid>

        <Grid item xs={12} sm={12} md={12} margin={1}>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {isEditMode ? '수정' : '등록'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
