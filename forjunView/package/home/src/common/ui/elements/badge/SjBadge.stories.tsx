import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SjBadge from './SjBadge';

const meta: Meta<typeof SjBadge> = {
  title: 'Common/UI/Elements/SjBadge',
  component: SjBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SjBadge>;

export const Default: Story = {
  args: {
    badgeContent: 4,
    badgeColor: 'error',
    badgeVariant: 'standard',
    children: <IconButton><NotificationsIcon /></IconButton>,
  },
};

export const Dot: Story = {
  args: {
    badgeVariant: 'dot',
    badgeColor: 'error',
    children: <IconButton><MailIcon /></IconButton>,
  },
};

export const WithMax: Story = {
  args: {
    badgeContent: 150,
    badgeColor: 'error',
    badgeVariant: 'standard',
    max: 99,
    children: <IconButton><ShoppingCartIcon /></IconButton>,
  },
};

export const DifferentColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <SjBadge badgeContent={4} badgeColor="error">
        <IconButton><NotificationsIcon /></IconButton>
      </SjBadge>
      <SjBadge badgeContent={4} badgeColor="primary">
        <IconButton><NotificationsIcon /></IconButton>
      </SjBadge>
      <SjBadge badgeContent={4} badgeColor="secondary">
        <IconButton><NotificationsIcon /></IconButton>
      </SjBadge>
      <SjBadge badgeContent={4} badgeColor="success">
        <IconButton><NotificationsIcon /></IconButton>
      </SjBadge>
      <SjBadge badgeContent={4} badgeColor="warning">
        <IconButton><NotificationsIcon /></IconButton>
      </SjBadge>
      <SjBadge badgeContent={4} badgeColor="info">
        <IconButton><NotificationsIcon /></IconButton>
      </SjBadge>
    </div>
  ),
};

export const WithText: Story = {
  args: {
    badgeContent: 'NEW',
    badgeColor: 'error',
    badgeVariant: 'standard',
    children: <span style={{ padding: '10px', border: '1px solid #ccc' }}>상품</span>,
  },
};




