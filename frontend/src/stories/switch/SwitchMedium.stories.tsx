import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { SwitchMedium } from '../../shared/components/ui/Switch';

const meta: Meta<typeof SwitchMedium> = {
  title: 'UI/Switch/SwitchMedium',
  component: SwitchMedium,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    checked: {
      control: { type: 'boolean' },
    },
    label: {
      control: { type: 'text' },
    },
    labelPlacement: {
      control: { type: 'select' },
      options: ['start', 'end', 'top', 'bottom'],
      defaultValue: 'end',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SwitchMedium>;

// Control the checked state in Storybook
const SwitchWithState = (args: any) => {
  const [checked, setChecked] = useState(args.checked || false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return <SwitchMedium {...args} checked={checked} onChange={handleChange} />;
};

export const Default: Story = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    checked: true,
  },
};

export const WithLabel: Story = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    label: 'Switch Label',
    checked: false,
  },
};

export const LabelPlacementStart: Story = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    label: 'Label on Start',
    labelPlacement: 'start',
    checked: false,
  },
};

export const Disabled: Story = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    disabled: true,
    checked: false,
  },
};

export const DisabledChecked: Story = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    disabled: true,
    checked: true,
  },
};
