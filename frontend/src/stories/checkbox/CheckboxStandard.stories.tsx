import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { CheckboxStandard } from '../../shared/components/ui/Checkbox';

const meta: Meta<typeof CheckboxStandard> = {
  title: 'UI/Checkbox/CheckboxStandard',
  component: CheckboxStandard,
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
type Story = StoryObj<typeof CheckboxStandard>;

// Control the checked state in Storybook
const CheckboxWithState = (args: any) => {
  const [checked, setChecked] = useState(args.checked || false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return <CheckboxStandard {...args} checked={checked} onChange={handleChange} />;
};

export const Default: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: {
    checked: true,
  },
};

export const WithLabel: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: {
    label: 'Checkbox Label',
    checked: false,
  },
};

export const LabelPlacementStart: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: {
    label: 'Label on Start',
    labelPlacement: 'start',
    checked: false,
  },
};

export const Disabled: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: {
    disabled: true,
    checked: false,
  },
};

export const DisabledChecked: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: {
    disabled: true,
    checked: true,
  },
};
