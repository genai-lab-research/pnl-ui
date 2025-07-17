import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from '../index';
import { MenuItem } from '../types';

const meta: Meta<typeof Menu> = {
  title: 'UI/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onItemClick: { action: 'item-clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems: MenuItem[] = [
  {
    id: 'edit-settings',
    label: 'Edit & Settings',
    action: () => {},
  },
  {
    id: 'view',
    label: 'View',
    action: () => {},
  },
  {
    id: 'shutdown',
    label: 'Shutdown',
    action: () => {},
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

export const WithCustomItems: Story = {
  args: {
    items: [
      {
        id: 'profile',
        label: 'Profile',
      },
      {
        id: 'settings',
        label: 'Settings',
      },
      {
        id: 'logout',
        label: 'Logout',
        disabled: true,
      },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        id: 'action',
        label: 'Single Action',
      },
    ],
  },
};