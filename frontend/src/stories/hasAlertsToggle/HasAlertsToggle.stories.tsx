import { Meta, StoryObj } from '@storybook/react';
import { HasAlertsToggle } from '../../shared/components/ui/HasAlertsToggle';

const meta = {
  title: 'UI/HasAlertsToggle',
  component: HasAlertsToggle,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof HasAlertsToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    label: 'Has Alerts',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: 'Has Alerts',
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'Has Alerts',
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    label: 'Has Alerts',
  },
};

export const CustomLabel: Story = {
  args: {
    checked: false,
    label: 'Show Notifications',
  },
};
