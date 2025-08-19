import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { ToggleSwitchProps } from './types';

const meta: Meta<typeof ToggleSwitch> = {
  title: 'UI/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable ToggleSwitch component for enabling/disabling features. Designed to be domain-agnostic and highly customizable.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'success', 'warning', 'danger'],
    },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Controlled component wrapper for stories
const ControlledToggleSwitch = (props: ToggleSwitchProps) => {
  const [checked, setChecked] = useState<boolean>(props.checked || false);
  
  return (
    <ToggleSwitch
      {...props}
      checked={checked}
      onChange={(newChecked) => {
        setChecked(newChecked);
        props.onChange?.(newChecked);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <ControlledToggleSwitch {...args} />,
  args: {
    label: 'Enable feature',
    size: 'medium',
    variant: 'default',
  },
};

export const Checked: Story = {
  render: (args) => <ControlledToggleSwitch {...args} />,
  args: {
    label: 'System lighting',
    checked: true,
    size: 'medium',
    variant: 'primary',
  },
};

export const WithHelperText: Story = {
  render: (args) => <ControlledToggleSwitch {...args} />,
  args: {
    label: 'Irrigation system',
    helperText: 'Automatically water plants based on soil moisture',
    size: 'medium',
    variant: 'success',
  },
};

export const Required: Story = {
  render: (args) => <ControlledToggleSwitch {...args} />,
  args: {
    label: 'Safety protocols',
    required: true,
    helperText: 'This setting is required for system operation',
    size: 'medium',
    variant: 'warning',
  },
};

export const Error: Story = {
  render: (args) => <ControlledToggleSwitch {...args} />,
  args: {
    label: 'Network connection',
    error: true,
    errorMessage: 'Unable to connect to network',
    size: 'medium',
    variant: 'danger',
  },
};

export const Disabled: Story = {
  render: (args) => <ControlledToggleSwitch {...args} />,
  args: {
    label: 'Maintenance mode',
    checked: true,
    disabled: true,
    helperText: 'Contact administrator to change this setting',
    size: 'medium',
  },
};

export const Loading: Story = {
  render: (args) => <ControlledToggleSwitch {...args} />,
  args: {
    label: 'Connecting to sensors',
    loading: true,
    size: 'medium',
    variant: 'primary',
  },
};

export const Small: Story = {
  render: (args) => <ControlledToggleSwitch {...args} />,
  args: {
    label: 'Compact setting',
    size: 'small',
    variant: 'primary',
  },
};

export const Large: Story = {
  render: (args) => <ControlledToggleSwitch {...args} />,
  args: {
    label: 'Main system power',
    size: 'large',
    variant: 'danger',
  },
};

export const WithoutLabel: Story = {
  render: (args) => <ControlledToggleSwitch {...args} />,
  args: {
    ariaLabel: 'Toggle feature',
    size: 'medium',
    variant: 'primary',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
      <h3>Color Variants</h3>
      
      <ControlledToggleSwitch
        label="Default variant"
        variant="default"
        checked={true}
      />
      
      <ControlledToggleSwitch
        label="Primary variant"
        variant="primary"
        checked={true}
      />
      
      <ControlledToggleSwitch
        label="Success variant"
        variant="success"
        checked={true}
      />
      
      <ControlledToggleSwitch
        label="Warning variant"
        variant="warning"
        checked={true}
      />
      
      <ControlledToggleSwitch
        label="Danger variant"
        variant="danger"
        checked={true}
      />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
      <h3>Size Variants</h3>
      
      <ControlledToggleSwitch
        label="Small switch"
        size="small"
        variant="primary"
        checked={true}
      />
      
      <ControlledToggleSwitch
        label="Medium switch"
        size="medium"
        variant="primary"
        checked={true}
      />
      
      <ControlledToggleSwitch
        label="Large switch"
        size="large"
        variant="primary"
        checked={true}
      />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
      <h3>Different States</h3>
      
      <ControlledToggleSwitch
        label="Normal state"
        helperText="Regular toggle switch"
        variant="primary"
      />
      
      <ControlledToggleSwitch
        label="Checked state"
        helperText="Switch is enabled"
        variant="primary"
        checked={true}
      />
      
      <ControlledToggleSwitch
        label="Disabled state"
        helperText="Cannot be changed"
        disabled={true}
      />
      
      <ControlledToggleSwitch
        label="Loading state"
        helperText="Processing request"
        loading={true}
        variant="primary"
      />
      
      <ControlledToggleSwitch
        label="Error state"
        error={true}
        errorMessage="Something went wrong"
        variant="danger"
      />
      
      <ControlledToggleSwitch
        label="Required field"
        required={true}
        helperText="This field is required"
        variant="warning"
      />
    </div>
  ),
};

// Demonstration of reusability across different contexts
export const ReusabilityDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <h3>Same Component, Different Contexts</h3>
      
      <div>
        <h4>🌱 Farming System Controls</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ControlledToggleSwitch
            label="Auto irrigation"
            helperText="Automatically water based on soil moisture"
            variant="success"
            checked={true}
          />
          
          <ControlledToggleSwitch
            label="LED grow lights"
            helperText="Provide supplemental lighting"
            variant="warning"
          />
          
          <ControlledToggleSwitch
            label="Climate control"
            helperText="Maintain optimal temperature and humidity"
            variant="primary"
            checked={true}
          />
        </div>
      </div>
      
      <div>
        <h4>⚙️ Application Settings</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ControlledToggleSwitch
            label="Dark mode"
            helperText="Use dark theme for better visibility"
            variant="default"
          />
          
          <ControlledToggleSwitch
            label="Push notifications"
            helperText="Receive alerts and updates"
            variant="primary"
            checked={true}
          />
          
          <ControlledToggleSwitch
            label="Auto-save"
            helperText="Automatically save changes"
            variant="success"
            checked={true}
          />
        </div>
      </div>
      
      <div>
        <h4>🔧 System Maintenance</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ControlledToggleSwitch
            label="Maintenance mode"
            helperText="Disable user access for updates"
            variant="danger"
            disabled={true}
          />
          
          <ControlledToggleSwitch
            label="Debug logging"
            helperText="Enable detailed system logs"
            variant="warning"
          />
          
          <ControlledToggleSwitch
            label="Auto backup"
            helperText="Create daily system backups"
            variant="success"
            checked={true}
          />
        </div>
      </div>
    </div>
  ),
};
