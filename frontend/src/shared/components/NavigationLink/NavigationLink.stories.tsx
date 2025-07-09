import type { Meta, StoryObj } from '@storybook/react';
import { NavigationLink } from './NavigationLink';

const meta = {
  title: 'Components/NavigationLink',
  component: NavigationLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof NavigationLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Container Dashboard / farm-container-04',
  },
};

export const CustomText: Story = {
  args: {
    text: 'Device Settings / Production',
  },
};