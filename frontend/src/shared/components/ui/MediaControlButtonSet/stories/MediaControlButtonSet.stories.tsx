import type { Meta, StoryObj } from '@storybook/react';
import MediaControlButtonSet from '../MediaControlButtonSet';

const meta: Meta<typeof MediaControlButtonSet> = {
  title: 'UI/MediaControlButtonSet',
  component: MediaControlButtonSet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onPreviousClick: { action: 'previous clicked' },
    onPlayClick: { action: 'play clicked' },
    onRepeatClick: { action: 'repeat clicked' },
    onNextClick: { action: 'next clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof MediaControlButtonSet>;

export const Default: Story = {
  args: {
    variant: 'default',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'default',
    disabled: true,
  },
};