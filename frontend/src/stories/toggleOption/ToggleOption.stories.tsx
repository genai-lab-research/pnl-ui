import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ToggleOption } from '../../shared/components/ui/ToggleOption';
import { Box, Typography } from '@mui/material';

const meta: Meta<typeof ToggleOption> = {
  title: 'UI/ToggleOption',
  component: ToggleOption,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The label for the toggle option',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the toggle is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
    size: {
      control: { type: 'select', options: ['small', 'medium'] },
      description: 'The size of the switch',
    },
    color: {
      control: 'color',
      description: 'The color of the switch when checked',
    },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleOption>;

// Interactive template for better demo experience
const InteractiveTemplate = (args: React.ComponentProps<typeof ToggleOption>) => {
  const [checked, setChecked] = useState(args.checked || false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    args.onChange?.(event);
  };
  
  return <ToggleOption {...args} checked={checked} onChange={handleChange} />;
};

// Default toggle option that matches the Figma design
export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Enable Shadow Service',
    checked: true,
    color: '#656CFF',
  },
};

// Disabled toggle option
export const Disabled: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Enable Shadow Service',
    disabled: true,
    checked: false,
  },
};

// Small size toggle option
export const Small: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Enable Shadow Service',
    size: 'small',
    checked: true,
  },
};

// Custom color toggle option
export const CustomColor: Story = {
  render: InteractiveTemplate,
  args: {
    label: 'Enable Shadow Service',
    checked: true,
    color: '#FF5733',
  },
};

// Multiple toggle options showcase
const ToggleOptionsShowcaseStory = () => {
  const [states, setStates] = useState({
    option1: true,
    option2: false,
    option3: true,
    option4: false,
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
      width: '380px',
      p: 2,
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
    }}>
      <Typography variant="h6">Toggle Options</Typography>
      
      <ToggleOption
        label="Enable Shadow Service"
        checked={states.option1}
        onChange={handleChange('option1')}
      />
      
      <ToggleOption
        label="Enable Auto-scaling"
        color="#FF5733"
        checked={states.option2}
        onChange={handleChange('option2')}
      />
      
      <ToggleOption
        label="Enable Backups"
        size="small"
        checked={states.option3}
        onChange={handleChange('option3')}
      />
      
      <ToggleOption
        label="Enable Maintenance Mode"
        checked={states.option4}
        onChange={handleChange('option4')}
        disabled
      />
    </Box>
  );
};

export const ToggleOptionsShowcase: Story = {
  render: () => <ToggleOptionsShowcaseStory />
};