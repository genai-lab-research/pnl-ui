import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../shared/components/ui/Avatar';
import FaceIcon from '@mui/icons-material/Face';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Create a theme for the stories
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
  },
});

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: { 
      control: { type: 'select' }, 
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      description: 'Size of the avatar'
    },
    variant: { 
      control: { type: 'select' }, 
      options: ['circular', 'rounded', 'square'],
      description: 'Shape variant of the avatar'
    },
    src: { 
      control: 'text',
      description: 'Image source URL'
    },
    srcSet: { 
      control: 'text',
      description: 'Responsive image sources'
    },
    name: { 
      control: 'text',
      description: 'Name (used for initials when src is not provided)'
    },
    alt: { 
      control: 'text',
      description: 'Alternative text for the image'
    },
    loading: {
      control: 'boolean',
      description: 'Display loading state'
    },
    status: {
      control: { type: 'select' },
      options: ['none', 'online', 'busy', 'away', 'offline'],
      description: 'Status indicator'
    },
    elevation: {
      control: { type: 'select' },
      options: [0, 1, 2, 3],
      description: 'Shadow elevation level'
    },
    bordered: {
      control: 'boolean',
      description: 'Add border to avatar'
    },
    borderColor: {
      control: 'color',
      description: 'Border color when bordered is true'
    },
    responsive: {
      control: 'boolean',
      description: 'Automatically adjust size based on screen size'
    },
    fallbackIcon: {
      control: false,
      description: 'Custom icon to display when no image or name is provided'
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default avatar story
export const Default: Story = {
  args: {},
};

// Avatar with image
export const WithImage: Story = {
  args: {
    src: 'https://mui.com/static/images/avatar/1.jpg',
    alt: 'User Avatar',
  },
};

// Avatar with name (displays initials)
export const WithName: Story = {
  args: {
    name: 'John Doe',
  },
};

// Avatar sizes
export const XSmall: Story = {
  args: {
    name: 'XS',
    size: 'xsmall',
  },
};

export const Small: Story = {
  args: {
    name: 'SM',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    name: 'MD',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    name: 'LG',
    size: 'large',
  },
};

export const XLarge: Story = {
  args: {
    name: 'XL',
    size: 'xlarge',
  },
};

// Avatar variants
export const Circular: Story = {
  args: {
    name: 'John Doe',
    variant: 'circular',
  },
};

export const Rounded: Story = {
  args: {
    name: 'John Doe',
    variant: 'rounded',
  },
};

export const Square: Story = {
  args: {
    name: 'John Doe',
    variant: 'square',
  },
};

// Status indicators
export const WithOnlineStatus: Story = {
  args: {
    name: 'John Doe',
    status: 'online',
  },
};

export const WithBusyStatus: Story = {
  args: {
    name: 'John Doe',
    status: 'busy',
  },
};

export const WithAwayStatus: Story = {
  args: {
    name: 'John Doe',
    status: 'away',
  },
};

export const WithOfflineStatus: Story = {
  args: {
    name: 'John Doe',
    status: 'offline',
  },
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
  },
};

// Elevation examples
export const WithElevation: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="E0" elevation={0} />
      <Avatar name="E1" elevation={1} />
      <Avatar name="E2" elevation={2} />
      <Avatar name="E3" elevation={3} />
    </Box>
  ),
};

// Border examples
export const WithBorder: Story = {
  args: {
    name: 'John Doe',
    bordered: true,
    borderColor: '#2196f3',
  },
};

// Custom fallback icon
export const CustomFallbackIcon: Story = {
  args: {
    fallbackIcon: <FaceIcon />,
  },
};

// Error handling (invalid src)
export const ImageLoadError: Story = {
  args: {
    src: 'https://invalid-image-url.jpg',
    name: 'Fallback Name',
  },
};

// Responsive example (this will adapt based on viewport size)
export const ResponsiveAvatar: Story = {
  args: {
    name: 'Responsive',
    size: 'xlarge',
    responsive: true,
  },
};

// Grouping examples - Basic variations
export const AvatarExamples: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar src="https://mui.com/static/images/avatar/1.jpg" alt="User 1" />
      <Avatar name="Jane Smith" />
      <Avatar loading />
      <Avatar fallbackIcon={<FaceIcon />} />
    </Box>
  ),
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="XS" size="xsmall" />
      <Avatar name="SM" size="small" />
      <Avatar name="MD" size="medium" />
      <Avatar name="LG" size="large" />
      <Avatar name="XL" size="xlarge" />
    </Box>
  ),
};

// Status variations
export const StatusVariations: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="ON" status="online" />
      <Avatar name="BS" status="busy" />
      <Avatar name="AW" status="away" />
      <Avatar name="OF" status="offline" />
    </Box>
  ),
};

// Profile display scenarios
export const ProfileDisplayScenarios: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Avatar 
          src="https://mui.com/static/images/avatar/2.jpg" 
          size="large" 
          status="online"
          elevation={2}
          bordered
          borderColor="white"
        />
        <Box>
          <div style={{ fontWeight: 'bold' }}>Jane Smith</div>
          <div style={{ color: '#666' }}>Online</div>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Avatar 
          name="Alex Johnson" 
          size="large" 
          status="busy"
        />
        <Box>
          <div style={{ fontWeight: 'bold' }}>Alex Johnson</div>
          <div style={{ color: '#666' }}>Busy</div>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Avatar 
          fallbackIcon={<AccountCircleIcon />}
          size="large" 
          status="offline"
        />
        <Box>
          <div style={{ fontWeight: 'bold' }}>Unknown User</div>
          <div style={{ color: '#666' }}>Offline</div>
        </Box>
      </Box>
    </Box>
  ),
};