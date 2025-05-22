import type { Meta, StoryObj } from '@storybook/react';
import { ArrowDropDownIcon } from '../../shared/components/ui/Icon/ArrowDropDownIcon';

const meta: Meta<typeof ArrowDropDownIcon> = {
  title: 'Components/Icon/ArrowDropDownIcon',
  component: ArrowDropDownIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fontSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'inherit'],
      defaultValue: 'medium',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success', 'inherit'],
      defaultValue: 'inherit',
    },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ArrowDropDownIcon>;

export const Default: Story = {
  args: {
    fontSize: 'medium',
  },
};

export const Small: Story = {
  args: {
    fontSize: 'small',
  },
};

export const Large: Story = {
  args: {
    fontSize: 'large',
  },
};

export const Colored: Story = {
  args: {
    fontSize: 'large',
    color: 'primary',
  },
};

export const CustomStyles: Story = {
  args: {
    sx: { 
      color: '#FF5722',
      fontSize: 40
    },
  },
};