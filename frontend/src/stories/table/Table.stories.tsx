import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableRowData } from '../../shared/components/ui/Table';
import { Chip } from '../../shared/components/ui/Chip';
import ErrorIcon from '@mui/icons-material/Error';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
  argTypes: {
    stickyHeader: {
      control: 'boolean',
      description: 'Whether to make the table header sticky when scrolling',
    },
    maxHeight: {
      control: 'number',
      description: 'Maximum height of the table before it starts scrolling',
    },
    zebraStriping: {
      control: 'boolean',
      description: 'Whether to apply alternating background colors to rows',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the table should take the full width of its container',
    },
    borderColor: {
      control: 'color',
      description: 'Color of the table border',
    },
    headerBgColor: {
      control: 'color',
      description: 'Background color of the table header',
    },
    headerTextColor: {
      control: 'color',
      description: 'Text color of the table header',
    },
    pagination: {
      control: 'boolean',
      description: 'Whether to enable pagination',
    },
    rowsPerPage: {
      control: 'number',
      description: 'Number of rows to show per page when pagination is enabled',
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// Custom cell renderer for status column
const renderStatusCell = (row: TableRowData) => {
  const statuses = {
    active: { label: 'Connected', color: 'active' },
    'in-progress': { label: 'In progress', color: 'in-progress' },
    inactive: { label: 'Inactive', color: 'inactive' },
  };
  
  // Handle array of statuses
  if (Array.isArray(row.status)) {
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {(row.status as string[]).map((status, index) => {
          const statusConfig = statuses[status as keyof typeof statuses] || { label: status, color: 'default' };
          return (
            <Chip 
              key={index} 
              value={statusConfig.label}
              status={statusConfig.color as 'active' | 'inactive' | 'default' | 'in-progress'}
              size="small"
            />
          );
        })}
      </Box>
    );
  }
  
  // Handle single status
  const status = row.status as string;
  const statusConfig = statuses[status as keyof typeof statuses] || { label: status, color: 'default' };
  
  return (
    <Chip 
      value={statusConfig.label}
      status={statusConfig.color as 'active' | 'inactive' | 'default' | 'in-progress'}
      size="small"
    />
  );
};

// Custom cell renderer for actions column
const renderActionsCell = () => (
  <IconButton size="small" aria-label="actions">
    <MoreVertIcon fontSize="small" />
  </IconButton>
);

// Custom cell renderer for overdue column
const renderOverdueCell = (row: TableRowData) => {
  const value = row.overdue as number;
  
  if (value === 0) {
    return (
      <Box display="flex" justifyContent="center">
        <Box 
          sx={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            bgcolor: '#479F67',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          0
        </Box>
      </Box>
    );
  } else if (value > 0) {
    return (
      <Box display="flex" justifyContent="center">
        <Box 
          sx={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            bgcolor: '#F97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          {value}
        </Box>
      </Box>
    );
  } else {
    return (
      <Box display="flex" justifyContent="center">
        <ErrorIcon color="error" />
      </Box>
    );
  }
};

// Sample data for stories
const columns = [
  { id: 'seedType', label: 'Seed Type', width: '18%', priority: 1 },
  { id: 'cultivationArea', label: 'Cultivation Area', width: '12%', align: 'left' as const, priority: 2 },
  { id: 'nurseryTable', label: 'Nursery Table', width: '12%', align: 'left' as const, priority: 2 },
  { id: 'lastSD', label: 'Last SD', width: '12%', align: 'left' as const, priority: 3 },
  { id: 'lastTD', label: 'Last TD', width: '12%', align: 'left' as const, priority: 3 },
  { id: 'lastHD', label: 'Last HD', width: '12%', align: 'left' as const, priority: 4 },
  { id: 'avgAge', label: 'Avg Age', width: '10%', align: 'left' as const, priority: 3 },
  { 
    id: 'overdue', 
    label: 'Overdue', 
    width: '12%', 
    align: 'center' as const, 
    priority: 1,
    renderCell: renderOverdueCell
  },
  {
    id: 'actions',
    label: '',
    width: '50px',
    align: 'center' as const,
    priority: 1,
    renderCell: renderActionsCell
  }
];

const rows = [
  { 
    seedType: 'Salanova Cousteau', 
    cultivationArea: '40', 
    nurseryTable: '30', 
    lastSD: '2025-01-30', 
    lastTD: '2025-01-30', 
    lastHD: '--', 
    avgAge: '26', 
    overdue: 2,
    status: ['in-progress', 'active']
  },
  { 
    seedType: 'Kiribati', 
    cultivationArea: '50', 
    nurseryTable: '20', 
    lastSD: '2025-01-30', 
    lastTD: '2025-01-30', 
    lastHD: '--', 
    avgAge: '30', 
    overdue: 0,
    status: 'active'
  },
  { 
    seedType: 'Rex Butterhead', 
    cultivationArea: '65', 
    nurseryTable: '10', 
    lastSD: '2025-01-10', 
    lastTD: '2025-01-20', 
    lastHD: '2025-01-01', 
    avgAge: '22', 
    overdue: 0,
    status: 'active' 
  },
  { 
    seedType: 'Lollo Rossa', 
    cultivationArea: '35', 
    nurseryTable: '25', 
    lastSD: '2025-01-15', 
    lastTD: '2025-01-20', 
    lastHD: '2025-05-02', 
    avgAge: '18', 
    overdue: 11,
    status: 'inactive'
  }
];

export const Default: Story = {
  args: {
    columns,
    rows,
    zebraStriping: false,
    borderColor: "#E9EDF4",
    headerBgColor: "#F5F5F7",
    headerTextColor: "rgba(76, 78, 100, 0.87)",
    pagination: true,
    rowsPerPage: 4,
  },
};

export const WithStickyHeader: Story = {
  args: {
    columns,
    rows: [...rows, ...rows], // Duplicate rows for scroll effect
    stickyHeader: true,
    maxHeight: 300,
    zebraStriping: false,
    borderColor: "#E9EDF4",
    headerBgColor: "#F5F5F7",
    headerTextColor: "rgba(76, 78, 100, 0.87)",
    pagination: true,
  },
};

export const WithZebraStriping: Story = {
  args: {
    columns,
    rows,
    zebraStriping: true,
    borderColor: "#E9EDF4",
    headerBgColor: "#F5F5F7",
    headerTextColor: "rgba(76, 78, 100, 0.87)",
    pagination: true,
  },
};

export const CustomStyled: Story = {
  args: {
    columns,
    rows,
    zebraStriping: false,
    borderColor: "#c0d6f9",
    headerBgColor: "#e0eafc",
    headerTextColor: "#1a3b7a",
    pagination: true,
  },
};

export const WithStatusChips: Story = {
  args: {
    columns: [
      { id: 'seedType', label: 'Seed Type', width: '18%', priority: 1 },
      { id: 'cultivationArea', label: 'Cultivation Area', width: '12%', priority: 2 },
      { 
        id: 'status', 
        label: 'Status', 
        width: '20%', 
        priority: 1,
        renderCell: renderStatusCell
      },
      { id: 'lastSD', label: 'Last SD', width: '12%', priority: 3 },
      { id: 'lastTD', label: 'Last TD', width: '12%', priority: 3 },
      { id: 'avgAge', label: 'Avg Age', width: '10%', priority: 2 },
      { 
        id: 'overdue', 
        label: 'Overdue', 
        width: '12%', 
        align: 'center' as const, 
        priority: 1,
        renderCell: renderOverdueCell
      },
    ],
    rows,
    zebraStriping: true,
    pagination: true,
  },
};

export const PixelPerfectReproduction: Story = {
  args: {
    columns: [
      { id: 'seedType', label: 'Seed Type', width: '18%', priority: 1 },
      { id: 'cultivationArea', label: 'Cultivation Area', width: '12%', align: 'left' as const, priority: 2 },
      { id: 'nurseryTable', label: 'Nursery Table', width: '12%', align: 'left' as const, priority: 2 },
      { id: 'lastSD', label: 'Last SD', width: '12%', align: 'left' as const, priority: 3 },
      { id: 'lastTD', label: 'Last TD', width: '12%', align: 'left' as const, priority: 3 },
      { id: 'lastHD', label: 'Last HD', width: '12%', align: 'left' as const, priority: 4 },
      { id: 'avgAge', label: 'Avg Age', width: '10%', align: 'left' as const, priority: 3 },
      { 
        id: 'overdue', 
        label: 'Overdue', 
        width: '12%', 
        align: 'center' as const, 
        priority: 1,
        renderCell: renderOverdueCell
      },
    ],
    rows: [
      { 
        seedType: 'Salanova Cousteau', 
        cultivationArea: '40', 
        nurseryTable: '30', 
        lastSD: '2025-01-30', 
        lastTD: '2025-01-30', 
        lastHD: '--', 
        avgAge: '26', 
        overdue: 2
      },
      { 
        seedType: 'Kiribati', 
        cultivationArea: '50', 
        nurseryTable: '20', 
        lastSD: '2025-01-30', 
        lastTD: '2025-01-30', 
        lastHD: '--', 
        avgAge: '30', 
        overdue: 0
      },
      { 
        seedType: 'Rex Butterhead', 
        cultivationArea: '65', 
        nurseryTable: '10', 
        lastSD: '2025-01-10', 
        lastTD: '2025-01-20', 
        lastHD: '2025-01-01', 
        avgAge: '22', 
        overdue: 0
      },
      { 
        seedType: 'Lollo Rossa', 
        cultivationArea: '35', 
        nurseryTable: '25', 
        lastSD: '2025-01-15', 
        lastTD: '2025-01-20', 
        lastHD: '2025-05-02', 
        avgAge: '18', 
        overdue: 11
      }
    ],
    zebraStriping: false,
    borderColor: "#E9EDF4",
    headerBgColor: "#F5F5F7",
    headerTextColor: "rgba(76, 78, 100, 0.87)",
    pagination: true,
  },
};

export const Small: Story = {
  args: {
    columns: columns.slice(0, 5), // Using fewer columns
    rows: rows.slice(0, 3), // Using fewer rows
    zebraStriping: false,
    fullWidth: false,
    borderColor: "#E9EDF4",
    headerBgColor: "#F5F5F7",
    headerTextColor: "rgba(76, 78, 100, 0.87)",
    pagination: true,
  },
};