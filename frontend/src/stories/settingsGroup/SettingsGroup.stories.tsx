import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { SettingsGroup } from '../../shared/components/ui/SettingsGroup';
import { Box } from '@mui/material';

const meta: Meta<typeof SettingsGroup> = {
  title: 'UI/SettingsGroup',
  component: SettingsGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the settings group',
    },
    options: {
      control: 'object',
      description: 'Array of setting options to render',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SettingsGroup>;

// Interactive template for better demo experience
const InteractiveTemplate = (args: React.ComponentProps<typeof SettingsGroup>) => {
  const [options, setOptions] = useState(args.options);
  
  const handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      checked
    };
    setOptions(newOptions);
  };
  
  const updatedOptions = options.map((option, index) => ({
    ...option,
    onChange: handleChange(index)
  }));
  
  return <SettingsGroup {...args} options={updatedOptions} />;
};

// Default SettingsGroup
export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    title: 'Settings',
    options: [
      { 
        label: 'Enable Shadow Service', 
        checked: true 
      }
    ],
  },
};

// SettingsGroup with multiple options
export const MultipleOptions: Story = {
  render: InteractiveTemplate,
  args: {
    title: 'Settings',
    options: [
      { 
        label: 'Enable Shadow Service', 
        checked: true 
      },
      { 
        label: 'Enable Notifications', 
        checked: false 
      },
      { 
        label: 'Dark Mode', 
        checked: false 
      }
    ],
  },
};

// SettingsGroup with disabled option
export const WithDisabledOption: Story = {
  render: InteractiveTemplate,
  args: {
    title: 'Settings',
    options: [
      { 
        label: 'Enable Shadow Service', 
        checked: true 
      },
      { 
        label: 'Enable Notifications', 
        checked: false,
        disabled: true
      }
    ],
  },
};

// Settings in a container
export const InContainer: Story = {
  render: (args) => (
    <Box sx={{ 
      width: '372px',
      padding: '16px',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <InteractiveTemplate {...args} />
    </Box>
  ),
  args: {
    title: 'Settings',
    options: [
      { 
        label: 'Enable Shadow Service', 
        checked: true 
      },
      { 
        label: 'Enable Notifications', 
        checked: false 
      }
    ],
  },
};