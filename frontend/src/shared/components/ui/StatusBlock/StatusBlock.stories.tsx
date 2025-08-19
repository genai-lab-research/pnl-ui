import type { Meta, StoryObj } from '@storybook/react';
import { Box, Grid } from '@mui/material';
import { 
  LocalShipping as ContainerIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  CloudQueue as CloudIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { StatusBlock } from './StatusBlock';

const meta = {
  title: 'UI/StatusBlock',
  component: StatusBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A reusable status block component that displays an icon, description text, and status badge. Perfect for dashboards, lists, and status indicators.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main description or title text',
    },
    status: {
      control: 'text',
      description: 'Status badge text',
    },
    statusVariant: {
      control: 'select',
      options: ['active', 'inactive', 'pending', 'success', 'warning', 'error'],
      description: 'Status badge variant that affects styling',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'outlined', 'elevated'],
      description: 'Visual variant',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
  },
} satisfies Meta<typeof StatusBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    title: 'Physical container | Tenant-123 | Development',
    status: 'Active',
    statusVariant: 'active',
    icon: <ContainerIcon />,
  },
};

// Different status variants
export const StatusVariants: Story = {
  render: () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <StatusBlock
          title="Container Service Running"
          status="Active"
          statusVariant="active"
          icon={<ContainerIcon />}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatusBlock
          title="Database Connection Lost"
          status="Inactive"
          statusVariant="inactive"
          icon={<StorageIcon />}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatusBlock
          title="Deployment in Progress"
          status="Pending"
          statusVariant="pending"
          icon={<CloudIcon />}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatusBlock
          title="System Health Check"
          status="Success"
          statusVariant="success"
          icon={<MemoryIcon />}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatusBlock
          title="Performance Issues Detected"
          status="Warning"
          statusVariant="warning"
          icon={<SpeedIcon />}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatusBlock
          title="Critical Error Occurred"
          status="Error"
          statusVariant="error"
          icon={<SettingsIcon />}
        />
      </Grid>
    </Grid>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap={2}>
      <StatusBlock
        title="Small Size Block"
        status="Active"
        statusVariant="active"
        icon={<ContainerIcon />}
        size="sm"
      />
      <StatusBlock
        title="Medium Size Block (Default)"
        status="Active"
        statusVariant="active"
        icon={<ContainerIcon />}
        size="md"
      />
      <StatusBlock
        title="Large Size Block"
        status="Active"
        statusVariant="active"
        icon={<ContainerIcon />}
        size="lg"
      />
    </Box>
  ),
};

// Different variants
export const Variants: Story = {
  render: () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <StatusBlock
          title="Default Variant"
          status="Active"
          statusVariant="active"
          icon={<ContainerIcon />}
          variant="default"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatusBlock
          title="Compact Variant"
          status="Active"
          statusVariant="active"
          icon={<ContainerIcon />}
          variant="compact"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatusBlock
          title="Outlined Variant"
          status="Active"
          statusVariant="active"
          icon={<ContainerIcon />}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatusBlock
          title="Elevated Variant"
          status="Active"
          statusVariant="active"
          icon={<ContainerIcon />}
          variant="elevated"
        />
      </Grid>
    </Grid>
  ),
};

// Different use cases with realistic data
export const UseCases: Story = {
  render: () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StatusBlock
          title="Kubernetes Pod | Namespace: production | Cluster: east-1"
          status="Running"
          statusVariant="success"
          icon={<CloudIcon />}
        />
      </Grid>
      <Grid item xs={12}>
        <StatusBlock
          title="Database Instance | PostgreSQL 14.2 | Primary Node"
          status="Online"
          statusVariant="active"
          icon={<StorageIcon />}
        />
      </Grid>
      <Grid item xs={12}>
        <StatusBlock
          title="API Gateway | Version 2.1.0 | Load Balancer"
          status="Degraded"
          statusVariant="warning"
          icon={<SettingsIcon />}
        />
      </Grid>
      <Grid item xs={12}>
        <StatusBlock
          title="Monitoring Service | Prometheus | Metrics Collection"
          status="Failed"
          statusVariant="error"
          icon={<SpeedIcon />}
        />
      </Grid>
    </Grid>
  ),
};

// Loading state
export const Loading: Story = {
  args: {
    title: 'Loading...',
    loading: true,
  },
};

// Error state
export const Error: Story = {
  args: {
    title: 'Service Status',
    error: 'Failed to load service status. Please try again.',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    title: 'Disabled Service | Maintenance Mode',
    status: 'Offline',
    statusVariant: 'inactive',
    icon: <ContainerIcon />,
    disabled: true,
  },
};

// Clickable with action
export const Clickable: Story = {
  args: {
    title: 'Clickable Service Block | Click to view details',
    status: 'Active',
    statusVariant: 'active',
    icon: <ContainerIcon />,
    onClick: () => alert('Status block clicked!'),
  },
};

// With footer slot
export const WithFooter: Story = {
  args: {
    title: 'Service with Additional Info',
    status: 'Active',
    statusVariant: 'active',
    icon: <ContainerIcon />,
    footerSlot: (
      <Box fontSize="0.75rem" color="text.secondary" mt={0.5}>
        Last updated: 2 minutes ago | CPU: 45% | Memory: 2.1GB
      </Box>
    ),
  },
};

// Responsive showcase
export const ResponsiveShowcase: Story = {
  render: () => (
    <Box>
      <Box mb={2}>
        <Box component="h3" mb={1}>Desktop (large screens)</Box>
        <Grid container spacing={1}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={4} key={i}>
              <StatusBlock
                title={`Service ${i} | Full Description Text`}
                status="Active"
                statusVariant="active"
                icon={<ContainerIcon />}
                size="lg"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mb={2}>
        <Box component="h3" mb={1}>Tablet (medium screens)</Box>
        <Grid container spacing={1}>
          {[1, 2].map((i) => (
            <Grid item xs={6} key={i}>
              <StatusBlock
                title={`Service ${i} | Medium Text`}
                status="Active"
                statusVariant="active"
                icon={<ContainerIcon />}
                size="md"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        <Box component="h3" mb={1}>Mobile (small screens)</Box>
        <StatusBlock
          title="Mobile Service | Compact"
          status="Active"
          statusVariant="active"
          icon={<ContainerIcon />}
          size="sm"
          variant="compact"
        />
      </Box>
    </Box>
  ),
};
