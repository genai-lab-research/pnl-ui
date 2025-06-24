import type { Meta, StoryObj } from '@storybook/react';
import { ContainerCreationDrawer } from '../../features/ContainerCreation';
import { ContainerFormData } from '../../features/ContainerCreation';

const meta: Meta<typeof ContainerCreationDrawer> = {
  title: 'Features/ContainerCreationDrawer',
  component: ContainerCreationDrawer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
    onClose: {
      action: 'onClose',
    },
    onContainerCreated: {
      action: 'onContainerCreated',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    onContainerCreated: (data: ContainerFormData) => console.log('Container created:', data),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    onContainerCreated: (data: ContainerFormData) => console.log('Container created:', data),
  },
};