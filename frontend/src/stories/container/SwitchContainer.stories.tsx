import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { SwitchContainer } from '../../shared/components/ui/Container';

const meta = {
  title: 'Container/SwitchContainer',
  component: SwitchContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SwitchContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Enable Notifications',
    checked: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Enable Notifications',
    description: 'You will receive alerts about system events',
    checked: true,
  },
};

export const LabelStart: Story = {
  args: {
    label: 'Enable Notifications',
    labelPlacement: 'start',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Enable Notifications',
    checked: true,
    disabled: true,
  },
};

export const SmallSize: Story = {
  args: {
    label: 'Enable Notifications',
    size: 'small',
    checked: false,
  },
};

// Interactive example with state
export const Interactive = () => {
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '250px' }}>
      <SwitchContainer
        label="Enable Notifications"
        description="You will receive alerts about system events"
        checked={enableNotifications}
        onChange={setEnableNotifications}
      />

      <SwitchContainer label="Dark Mode" checked={darkMode} onChange={setDarkMode} />

      <SwitchContainer
        label="Auto Save"
        description="Save changes automatically every 5 minutes"
        checked={autoSave}
        onChange={setAutoSave}
      />
    </div>
  );
};
