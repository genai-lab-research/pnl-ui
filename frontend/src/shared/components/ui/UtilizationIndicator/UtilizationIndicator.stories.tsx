import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UtilizationIndicator } from './UtilizationIndicator';

const meta: Meta<typeof UtilizationIndicator> = {
  title: 'UI/UtilizationIndicator',
  component: UtilizationIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The utilization percentage (0-100)',
    },
    label: {
      control: 'text',
      description: 'The label text displayed before the percentage',
    },
  },
};

export default meta;
type Story = StoryObj<typeof UtilizationIndicator>;

export const Default: Story = {
  args: {
    percentage: 75,
    label: 'Utilization:',
  },
};

export const LowUtilization: Story = {
  args: {
    percentage: 25,
    label: 'Utilization:',
  },
};

export const HighUtilization: Story = {
  args: {
    percentage: 95,
    label: 'Utilization:',
  },
};

export const CustomLabel: Story = {
  args: {
    percentage: 60,
    label: 'Usage:',
  },
};