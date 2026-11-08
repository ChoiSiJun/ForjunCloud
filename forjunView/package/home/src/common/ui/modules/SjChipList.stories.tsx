import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import SjChipList from './SjChipList';

const StatefulChipList = ({ initialItems }: { initialItems: string[] }) => {
  const [items, setItems] = useState(initialItems);
  const handleDelete = (index: number) => {
    setItems(current => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return <SjChipList dataList={items} onDelete={handleDelete} />;
};

const meta: Meta<typeof SjChipList> = {
  title: 'Common/UI/Molecules/SjChipList',
  component: SjChipList,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof SjChipList>;

export const Default: Story = {
  render: () => <StatefulChipList initialItems={['React', 'TypeScript', 'Material UI']} />,
};

export const Empty: Story = {
  render: () => <StatefulChipList initialItems={[]} />,
};

export const ManyItems: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <StatefulChipList initialItems={['React', 'TypeScript', 'Material UI', 'Vite', 'Storybook', 'Redux', 'React Query', 'Axios', 'Formik', 'Yup']} />
    </div>
  ),
};
