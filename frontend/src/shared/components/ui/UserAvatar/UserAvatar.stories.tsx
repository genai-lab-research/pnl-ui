import type { Meta, StoryObj } from '@storybook/react';
import UserAvatar from './UserAvatar';

const meta = {
  title: 'Shared/UserAvatar',
  component: UserAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['circle', 'rounded', 'square'],
    },
    badgePosition: {
      control: { type: 'radio' },
      options: ['top-right', 'bottom-right', 'top-left', 'bottom-left'],
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'John Doe',
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
};

export const WithInitials: Story = {
  args: {
    name: 'Jane Smith',
  },
};

export const CustomInitials: Story = {
  args: {
    name: 'Robert Johnson',
    initials: 'RJ',
  },
};

export const Small: Story = {
  args: {
    name: 'Alice Cooper',
    src: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    name: 'Bob Wilson',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    name: 'Carol Brown',
    src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    name: 'David Miller',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    size: 'xl',
  },
};

export const Rounded: Story = {
  args: {
    name: 'Emma Davis',
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    variant: 'rounded',
  },
};

export const Square: Story = {
  args: {
    name: 'Frank Garcia',
    src: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
    variant: 'square',
  },
};

export const WithBadge: Story = {
  args: {
    name: 'Grace Lee',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    badge: true,
  },
};

export const WithBadgeContent: Story = {
  args: {
    name: 'Henry Taylor',
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    badge: true,
    badgeContent: '5',
  },
};

export const BadgePositions: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Top Right"
          src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face"
          badge={true}
          badgePosition="top-right"
          size="lg"
        />
        <p>Top Right</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Top Left"
          src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face"
          badge={true}
          badgePosition="top-left"
          size="lg"
        />
        <p>Top Left</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Bottom Right"
          src="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face"
          badge={true}
          badgePosition="bottom-right"
          size="lg"
        />
        <p>Bottom Right</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Bottom Left"
          src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face"
          badge={true}
          badgePosition="bottom-left"
          size="lg"
        />
        <p>Bottom Left</p>
      </div>
    </div>
  ),
};

export const InitialsFallback: Story = {
  args: {
    name: 'Isabella Rodriguez',
    src: 'invalid-url.jpg', // This will fail to load and show initials
  },
};

export const CustomColors: Story = {
  args: {
    name: 'Jack Thompson',
    backgroundColor: '#8B5CF6',
    textColor: '#FFFFFF',
  },
};

export const Loading: Story = {
  args: {
    name: 'Loading User',
    loading: true,
  },
};

export const Error: Story = {
  args: {
    name: 'Error User',
    error: 'Failed to load avatar',
  },
};

export const Interactive: Story = {
  args: {
    name: 'Clickable User',
    src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    onClick: () => alert('Avatar clicked!'),
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Small Avatar"
          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face"
          size="sm"
        />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Small</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Medium Avatar"
          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face"
          size="md"
        />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Medium</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Large Avatar"
          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
          size="lg"
        />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Large</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Extra Large Avatar"
          src="https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=150&h=150&fit=crop&crop=face"
          size="xl"
        />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Extra Large</p>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Circle Avatar"
          src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face"
          variant="circle"
          size="lg"
        />
        <p style={{ marginTop: '0.5rem' }}>Circle</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Rounded Avatar"
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
          variant="rounded"
          size="lg"
        />
        <p style={{ marginTop: '0.5rem' }}>Rounded</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <UserAvatar
          name="Square Avatar"
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
          variant="square"
          size="lg"
        />
        <p style={{ marginTop: '0.5rem' }}>Square</p>
      </div>
    </div>
  ),
};

export const InitialsGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
      {[
        'Alice Johnson',
        'Bob Smith',
        'Carol Davis',
        'David Wilson',
        'Emma Brown',
        'Frank Miller',
        'Grace Lee',
        'Henry Taylor',
      ].map((name) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <UserAvatar name={name} size="md" />
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>{name}</p>
        </div>
      ))}
    </div>
  ),
};