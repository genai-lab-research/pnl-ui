import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Button } from '@mui/material';
import CreateContainerPage from '../../pages/CreateContainerPage';

const meta: Meta<typeof CreateContainerPage> = {
  title: 'Pages/CreateContainerPage',
  component: CreateContainerPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Create Container Page - A drawer-based form for creating new containers with comprehensive input fields, validation, and API integration.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the drawer is open'
    },
    onClose: {
      action: 'onClose',
      description: 'Function called when the drawer is closed'
    },
    onSubmit: {
      action: 'onSubmit',
      description: 'Function called when the form is submitted'
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const CreateContainerPageWithTrigger = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        variant="contained" 
        onClick={() => setIsOpen(true)}
        sx={{ mb: 2 }}
      >
        Open Create Container Form
      </Button>
      
      <CreateContainerPage
        {...args}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(data) => {
          console.log('Form submitted with data:', data);
          args.onSubmit?.(data);
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: CreateContainerPageWithTrigger,
  args: {
    open: false,
    onClose: fn(),
    onSubmit: fn(),
  },
};

export const OpenByDefault: Story = {
  args: {
    open: true,
    onClose: fn(),
    onSubmit: fn(),
  },
};

export const InteractiveDemo: Story = {
  render: CreateContainerPageWithTrigger,
  args: {
    open: false,
    onClose: fn(),
    onSubmit: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing the full Create Container workflow. Click the button to open the form and test all features.',
      },
    },
  },
};