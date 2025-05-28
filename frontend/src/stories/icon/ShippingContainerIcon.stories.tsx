import type { Meta, StoryObj } from '@storybook/react';

import ShippingContainerIcon from '../../shared/components/ui/Icon/ShippingContainerIcon';

const meta: Meta<typeof ShippingContainerIcon> = {
  title: 'Components/Icon/ShippingContainerIcon',
  component: ShippingContainerIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    size: { control: { type: 'number' } },
  },
};

export default meta;
type Story = StoryObj<typeof ShippingContainerIcon>;

export const Default: Story = {
  args: {},
};

export const Colored: Story = {
  args: {
    color: '#1976d2',
  },
};

export const Small: Story = {
  args: {
    size: 16,
  },
};

export const Medium: Story = {
  args: {
    size: 24,
  },
};

export const Large: Story = {
  args: {
    size: 36,
  },
};
