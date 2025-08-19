import type { Meta, StoryObj } from '@storybook/react';
import { GenerationBlock, useGenerationBlockState } from '../shared/components/ui/GenerationBlock';
import { FilterChip } from '../shared/components/ui/GenerationBlock/types';

const meta = {
  title: 'UI/GenerationBlock',
  component: GenerationBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A filter and search toolbar component for the Vertical-Farming Control Panel. Contains search input, filter chips, alerts toggle, and clear filters button.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    searchValue: {
      control: 'text',
      description: 'Current search input value',
    },
    onSearchChange: {
      action: 'search-changed',
      description: 'Callback when search value changes',
    },
    filterChips: {
      control: 'object',
      description: 'Array of filter chip configurations',
    },
    onChipClick: {
      action: 'chip-clicked',
      description: 'Callback when a filter chip is clicked',
    },
    hasAlerts: {
      control: 'boolean',
      description: 'Whether the alerts toggle is enabled',
    },
    onAlertsToggle: {
      action: 'alerts-toggled',
      description: 'Callback when alerts toggle is changed',
    },
    onClearFilters: {
      action: 'filters-cleared',
      description: 'Callback when clear filters button is clicked',
    },
  },
} satisfies Meta<typeof GenerationBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFilterChips: FilterChip[] = [
  { id: 'types', label: 'All types' },
  { id: 'tenants', label: 'All tenants' },
  { id: 'purposes', label: 'All purposes' },
  { id: 'statuses', label: 'All statuses' },
];

export const Default: Story = {
  args: {
    searchValue: '',
    filterChips: defaultFilterChips,
    hasAlerts: false,
  },
};

export const WithSearchValue: Story = {
  args: {
    searchValue: 'container-01',
    filterChips: defaultFilterChips,
    hasAlerts: false,
  },
};

export const WithAlertsEnabled: Story = {
  args: {
    searchValue: '',
    filterChips: defaultFilterChips,
    hasAlerts: true,
  },
};

export const WithActiveFilters: Story = {
  args: {
    searchValue: 'hydroponic',
    filterChips: [
      { id: 'types', label: 'Hydroponic', isActive: true },
      { id: 'tenants', label: 'Farm-A', isActive: true },
      { id: 'purposes', label: 'All purposes' },
      { id: 'statuses', label: 'Active', isActive: true },
    ],
    hasAlerts: true,
  },
};

export const EmptyState: Story = {
  args: {
    searchValue: '',
    filterChips: defaultFilterChips,
    hasAlerts: false,
  },
};

export const ResponsiveDemo: Story = {
  args: {
    searchValue: 'containers',
    filterChips: defaultFilterChips,
    hasAlerts: true,
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
    },
    docs: {
      description: {
        story: 'This story demonstrates the responsive behavior of the GenerationBlock component across different screen sizes.',
      },
    },
  },
};

const InteractiveGenerationBlock = () => {
  const {
    searchValue,
    filterChips,
    hasAlerts,
    handleSearchChange,
    handleChipClick,
    handleAlertsToggle,
    handleClearFilters
  } = useGenerationBlockState();

  return (
    <GenerationBlock
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      filterChips={filterChips}
      onChipClick={handleChipClick}
      hasAlerts={hasAlerts}
      onAlertsToggle={handleAlertsToggle}
      onClearFilters={handleClearFilters}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveGenerationBlock />,
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the fully interactive GenerationBlock component with built-in state management using the useGenerationBlockState hook.',
      },
    },
  },
};