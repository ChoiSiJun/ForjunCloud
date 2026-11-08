import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@mui/material';
import SjCard from './SjCard';

const meta: Meta<typeof SjCard> = {
  title: 'Common/UI/Modules/SjCard',
  component: SjCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SjCard>;

export const Default: Story = {
  args: {
    title: '카드 제목',
    children: '카드 내용입니다.',
  },
};

export const WithSubheader: Story = {
  args: {
    title: '카드 제목',
    subheader: '부제목입니다',
    children: '카드 내용입니다.',
  },
};

export const WithActions: Story = {
  args: {
    title: '카드 제목',
    children: '카드 내용입니다.',
    actions: (
      <>
        <Button size="small">취소</Button>
        <Button size="small" variant="contained">확인</Button>
      </>
    ),
  },
};

export const Clickable: Story = {
  args: {
    title: '클릭 가능한 카드',
    subheader: '클릭해보세요',
    children: '이 카드는 클릭할 수 있습니다.',
    onClick: action('카드 클릭'),
  },
};

export const CustomSize: Story = {
  args: {
    title: '커스텀 크기',
    children: '너비와 높이가 설정된 카드입니다.',
    width: 400,
    height: 300,
  },
};

export const WithElevation: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <SjCard title="낮은 그림자" elevation={1}>elevation: 1</SjCard>
      <SjCard title="중간 그림자" elevation={4}>elevation: 4</SjCard>
      <SjCard title="높은 그림자" elevation={8}>elevation: 8</SjCard>
    </div>
  ),
};




