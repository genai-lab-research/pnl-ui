import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { CreateContainerButton } from '../../shared/components/ui/CreateContainerButton';

const meta: Meta<typeof CreateContainerButton> = {
  title: 'UI/CreateContainerButton',
  component: CreateContainerButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CreateContainerButton>;

export const Default: Story = {
  args: {
    onClick: action('button-clicked'),
  },
};

export const Disabled: Story = {
  args: {
    onClick: action('button-clicked'),
    disabled: true,
  },
};