import type { Meta, StoryObj } from '@storybook/react';
import { Talk2DBHeader } from '../Talk2DBHeader';

const meta: Meta<typeof Talk2DBHeader> = {
  title: 'UI/Talk2DBHeader',
  component: Talk2DBHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title text to display in the header',
      defaultValue: 'Talk2DB',
    },
    showBotIcon: {
      control: 'boolean',
      description: 'Whether to show the bot icon',
      defaultValue: true,
    },
    onExpand: {
      action: 'onExpand',
      description: 'Callback function when expand icon is clicked',
    },
    onClose: {
      action: 'onClose',
      description: 'Callback function when close icon is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Talk2DB',
    showBotIcon: true,
    onExpand: () => console.log('Expand clicked'),
    onClose: () => console.log('Close clicked'),
  },
};

export const WithoutBotIcon: Story = {
  args: {
    ...Default.args,
    showBotIcon: false,
  },
};

export const CustomTitle: Story = {
  args: {
    ...Default.args,
    title: 'Custom Title',
  },
};

export const WithoutActions: Story = {
  args: {
    title: 'Talk2DB',
    showBotIcon: true,
  },
};

export const OnlyExpand: Story = {
  args: {
    title: 'Talk2DB',
    showBotIcon: true,
    onExpand: () => console.log('Expand clicked'),
  },
};

export const OnlyClose: Story = {
  args: {
    title: 'Talk2DB',
    showBotIcon: true,
    onClose: () => console.log('Close clicked'),
  },
};