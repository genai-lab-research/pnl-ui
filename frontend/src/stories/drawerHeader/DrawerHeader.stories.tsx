import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { Box } from '@mui/material';
import { DrawerHeader } from '../../shared/components/ui/DrawerHeader/DrawerHeader';

export default {
  title: 'Components/DrawerHeader',
  component: DrawerHeader,
  parameters: {
    layout: 'centered',
    componentSubtitle: 'A header component for drawer dialogs',
  },
  argTypes: {
    title: { 
      control: 'text',
      description: 'The title text to display',
    },
    onClose: { 
      action: 'closed',
      description: 'Function called when the close button is clicked' 
    },
  },
} as Meta<typeof DrawerHeader>;

const Template: StoryFn<typeof DrawerHeader> = (args) => (
  <Box sx={{ width: 372, backgroundColor: 'white', p: 2 }}>
    <DrawerHeader {...args} />
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Create New Container',
};

export const WithLongTitle = Template.bind({});
WithLongTitle.args = {
  title: 'This is a Very Long Drawer Header Title That Will Test Wrapping',
};

export const InContainer = () => (
  <Box sx={{ 
    width: 372, 
    height: 300, 
    backgroundColor: 'white', 
    p: 2,
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  }}>
    <DrawerHeader
      title="Create New Container"
      onClose={() => console.log('Closed')}
    />
    <Box sx={{ p: 2 }}>
      <p>Drawer content would go here...</p>
    </Box>
  </Box>
);