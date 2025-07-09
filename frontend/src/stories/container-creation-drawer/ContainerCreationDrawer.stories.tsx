import type { Meta, StoryObj } from '@storybook/react';
import { ContainerManagement } from '../../features/ContainerManagement';
import { ContainerCreateRequest } from '../../types/verticalFarm';

// Create a mock component for the drawer since it doesn't exist yet
const ContainerCreationDrawer = ({ open, onClose, onContainerCreated }: {
  open: boolean;
  onClose: () => void;
  onContainerCreated: (data: ContainerCreateRequest) => void;
}) => {
  return open ? (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Container Creation Drawer</h3>
      <p>This is a placeholder for the container creation drawer component.</p>
      <button onClick={onClose}>Close</button>
      <button onClick={() => onContainerCreated({ name: 'Test Container' })}>
        Create Container
      </button>
    </div>
  ) : null;
};

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
    onContainerCreated: (data: ContainerCreateRequest) => console.log('Container created:', data),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    onContainerCreated: (data: ContainerCreateRequest) => console.log('Container created:', data),
  },
};