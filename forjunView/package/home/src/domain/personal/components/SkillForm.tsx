// 📁 SkillForm.tsx

import SjTextField from '@common/ui/elements/input/SjTextField';
import SjText from '@common/ui/elements/text/SjText';
import SjChipList from '@common/ui/modules/SjChipList';
import SjButton from '@common/ui/elements/button/SjButton';
import { Paper, Grid, Box } from '@mui/material';
import React, { useState, useMemo } from 'react';
import { usePersonal } from '@domain/personal/hooks/usePersonal';

interface SkillFormProps {
  personalHook: ReturnType<typeof usePersonal>;
}

const SkillForm = ({ personalHook }: SkillFormProps) => {
  const { skills, handleAddListItem, handleRemoveListItem } = personalHook;

  // 입력 필드의 현재 상태를 관리하기 위한 로컬 state를 추가합니다.
  const [skillCategory, setSkillCategory] = useState('');
  const [skillName, setSkillName] = useState('');

  // skills를 skillCategory별로 그룹화
  const groupedSkills = useMemo(() => {
    const groups: Record<string, Array<{ skillName: string; originalIndex: number }>> = {};
    skills.forEach((skill, index) => {
      const category = skill.skillCategory || '기타';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push({ skillName: skill.skillName, originalIndex: index });
    });
    return groups;
  }, [skills]);

  // 추가 로직을 별도 함수로 분리하여 Enter 키와 버튼 클릭 모두에서 사용
  const handleAddItem = () => {
    const category = skillCategory.trim();
    const name = skillName.trim();

    if (category && name) {
      // 부모 훅에서 가져온 함수 호출. 'skills' 필드를 명시적으로 전달합니다.
      handleAddListItem('skills', { skillCategory: category, skillName: name });
      setSkillCategory(''); // 입력창 초기화
      setSkillName(''); // 입력창 초기화
    }
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // skillName 입력 필드로 포커스 이동
      const skillNameInput = document.getElementById('skill-name-input');
      if (skillNameInput) {
        skillNameInput.focus();
      }
    }
  };

  const handleSkillNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  // SjTextField의 value와 onChange 핸들러를 관리합니다.
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillCategory(e.target.value);
  };

  const handleSkillNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillName(e.target.value);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <SjText renderType="title" text="기술내역" />

      <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <SjTextField id="skill-category-input" label="기술 카테고리" value={skillCategory} onChange={handleCategoryChange} onKeyDown={handleCategoryKeyDown} placeholder="예: 프론트엔드" />
        </Grid>
        <Grid item xs={6}>
          <SjTextField
            id="skill-name-input"
            label="기술명 (Enter 또는 버튼으로 등록)"
            value={skillName}
            onChange={handleSkillNameChange}
            onKeyDown={handleSkillNameKeyDown}
            placeholder="예: React"
          />
        </Grid>
        <Grid item xs={2}>
          <SjButton ButtonType="input" buttonName="추가" onClick={handleAddItem} />
        </Grid>
      </Grid>

      {/* skillCategory별로 그룹화하여 표시 */}
      {Object.entries(groupedSkills).map(([category, skillList]) => (
        <Box key={category} sx={{ mb: 3 }}>
          <SjText
            renderType="subtitle"
            text={category}
            sx={{
              mb: 1,
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline',
              },
            }}
            onClick={() => {
              setSkillCategory(category);
              // 입력 필드에 포커스 이동
              const categoryInput = document.getElementById('skill-category-input');
              if (categoryInput) {
                categoryInput.focus();
              }
            }}
          />
          <SjChipList
            dataList={skillList.map(item => item.skillName)}
            onDelete={chipIndex => {
              // chipIndex는 해당 카테고리 내의 인덱스이므로, 원본 배열의 인덱스로 변환
              const {originalIndex} = skillList[chipIndex];
              handleRemoveListItem('skills', originalIndex);
            }}
          />
        </Box>
      ))}
    </Paper>
  );
};

export default SkillForm;
