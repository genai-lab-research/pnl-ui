import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import SegmentedButton from '../../shared/components/ui/SegmentedButton';
import { SegmentedButtonProps } from '../../shared/components/ui/SegmentedButton/types';

const meta: Meta<typeof SegmentedButton> = {
  title: 'UI/SegmentedButton',
  component: SegmentedButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SegmentedButton>;

const SegmentedButtonTemplate = (args: SegmentedButtonProps) => {
  const [value, setValue] = useState(args.value);
  
  return (
    <SegmentedButton 
      {...args} 
      value={value} 
      onChange={(newValue) => setValue(newValue)} 
    />
  );
};

export const Default: Story = {
  render: SegmentedButtonTemplate,
  args: {
    options: [
      { value: 'physical', label: 'Physical' },
      { value: 'virtual', label: 'Virtual' },
    ],
    value: 'physical',
    ariaLabel: 'Generation block type',
  },
};