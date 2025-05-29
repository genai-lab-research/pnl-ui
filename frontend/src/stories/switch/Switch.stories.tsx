import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../../shared/components/ui/Switch';
import { Box, Typography } from '@mui/material';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    label: {
      control: 'text',
      description: 'The label for the switch',
    },
    size: {
      control: { type: 'select', options: ['small', 'medium'] },
      description: 'The size of the switch',
    },
    labelPlacement: {
      control: { type: 'select', options: ['start', 'end', 'top', 'bottom'] },
      description: 'The placement of the label',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show the label',
    },
    color: {
      control: 'color',
      description: 'The color of the switch when checked',
    },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// Interactive template for better demo experience
const InteractiveTemplate = (args: React.ComponentProps<typeof Switch>) => {
  const [checked, setChecked] = useState(args.checked || false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    args.onChange?.(event);
  };
  
  return <Switch {...args} checked={checked} onChange={handleChange} />;
};

// Basic switch
export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    checked: true,
    color: '#656CFF',
  },
};

// Switch with label
export const WithLabel: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Switch label',
    labelPlacement: 'start',
    checked: true,
    color: '#656CFF',
  },
};

// Disabled switch
export const Disabled: Story = {
  render: InteractiveTemplate,
  args: {
    disabled: true,
    checked: false,
  },
};

// Small switch
export const Small: Story = {
  render: InteractiveTemplate,
  args: {
    size: 'small',
    checked: true,
    color: '#656CFF',
  },
};

// Custom color switch
export const CustomColor: Story = {
  render: InteractiveTemplate,
  args: {
    checked: true,
    color: '#FF5733',
  },
};

// Switch with end label placement
export const WithEndLabel: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'End label',
    labelPlacement: 'end',
    checked: true,
  },
};

// Multiple switches showcase
const SwitchShowcaseStory = () => {
  const [states, setStates] = useState({
    switch1: true,
    switch2: false,
    switch3: true,
    switch4: false,
  });
  
  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setStates({
      ...states,
      [name]: event.target.checked,
    });
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3, 
      width: '280px',
      p: 2,
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
    }}>
      <Typography variant="h6">Switch Showcase</Typography>
      
      <Switch
        label="Default switch"
        checked={states.switch1}
        onChange={handleChange('switch1')}
        labelPlacement="start"
      />
      
      <Switch
        label="Custom color switch"
        color="#FF5733"
        checked={states.switch2}
        onChange={handleChange('switch2')}
        labelPlacement="start"
      />
      
      <Switch
        label="Small switch"
        size="small"
        checked={states.switch3}
        onChange={handleChange('switch3')}
        labelPlacement="start"
      />
      
      <Switch
        label="Disabled switch"
        checked={states.switch4}
        onChange={handleChange('switch4')}
        disabled
        labelPlacement="start"
      />
    </Box>
  );
};

export const SwitchShowcase: Story = {
  render: () => <SwitchShowcaseStory />
};