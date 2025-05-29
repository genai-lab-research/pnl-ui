import type { Meta, StoryObj } from '@storybook/react';
import { MetricCardsContainer } from '../../shared/components/ui/MetricCardsContainer';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import Co2Icon from '@mui/icons-material/Co2';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';

// Sample metrics data that matches the JSON structure from Figma
const sampleMetrics = [
  {
    title: 'Air Temperature',
    value: '20°C',
    targetValue: '21°C',
    icon: <DeviceThermostatIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
  {
    title: 'Rel. Humidity',
    value: '65%',
    targetValue: '68%',
    icon: <WaterDropIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
  {
    title: 'CO₂ Level',
    value: '860',
    targetValue: '800-900ppm',
    icon: <Co2Icon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
  {
    title: 'Yield',
    value: '51KG',
    targetValue: '+1.5Kg',
    icon: <AgricultureIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
  {
    title: 'Nursery Station Utilization',
    value: '75%',
    targetValue: '+5%',
    icon: <CalendarViewMonthIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
  {
    title: 'Cultivation Area Utilization',
    value: '90%',
    targetValue: '+15%',
    icon: <ViewWeekIcon style={{ color: '#9CA3AF', opacity: 0.7 }} />,
  },
];

const meta = {
  title: 'UI/MetricCardsContainer',
  component: MetricCardsContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'MetricCardsContainer displays a responsive grid of metric cards, adapting to different viewport sizes. The container automatically adjusts the number of cards per row and spacing based on screen size, ensuring optimal layout across devices.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    metrics: { 
      description: 'Array of metric data objects to display',
    },
    useFluidGrid: {
      control: 'boolean',
      description: 'Whether to use fluid grid layout (CSS Grid) or fixed columns (Material UI Grid)',
    },
  },
} satisfies Meta<typeof MetricCardsContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default MetricCardsContainer story
export const Default: Story = {
  args: {
    metrics: sampleMetrics,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default implementation with Material UI Grid layout. The number of cards per row adjusts based on screen size: 4 cards on desktop, 3 on tablet, 2 on small tablet, and 1 on mobile.'
      }
    }
  }
};

// Fluid Grid Layout
export const FluidGridLayout: Story = {
  args: {
    metrics: sampleMetrics,
    useFluidGrid: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Implementation using CSS Grid with auto-fill for more fluid card sizing. Cards automatically fill available space based on container width.'
      }
    }
  }
};

// Fewer Cards
export const FewerCards: Story = {
  args: {
    metrics: sampleMetrics.slice(0, 3), // Only first 3 metrics
  },
  parameters: {
    docs: {
      description: {
        story: 'MetricCardsContainer with fewer cards, demonstrating how the layout adapts to a smaller number of items.'
      }
    }
  }
};

// Many Cards
export const ManyCards: Story = {
  args: {
    metrics: [
      ...sampleMetrics,
      ...sampleMetrics.map((metric) => ({...metric, title: `${metric.title} (Copy)`}))
    ], // Double the number of cards
  },
  parameters: {
    docs: {
      description: {
        story: 'MetricCardsContainer with a larger number of cards, showing how the grid handles many items while maintaining proper spacing and alignment.'
      }
    }
  }
};

// Responsive view examples
export const MobileView: Story = {
  args: {
    metrics: sampleMetrics,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'MetricCardsContainer optimized for mobile screens. Cards stack in a single column with appropriate spacing and padding.'
      }
    }
  },
};

export const TabletView: Story = {
  args: {
    metrics: sampleMetrics,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'MetricCardsContainer on tablet screens. Cards arranged in a 2-3 column layout with adjusted spacing.'
      }
    }
  },
};

// Demonstration of different breakpoints
export const ResponsiveBreakpoints: StoryObj = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'This showcase demonstrates how MetricCardsContainer adapts across multiple breakpoints.'
      }
    }
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}>
        <div>
          <h3 style={{ marginBottom: '16px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Desktop (1200px+)
          </h3>
          <div style={{ maxWidth: '1200px' }}>
            <MetricCardsContainer metrics={sampleMetrics} />
          </div>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '16px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Tablet (900-1199px)
          </h3>
          <div style={{ maxWidth: '900px' }}>
            <MetricCardsContainer metrics={sampleMetrics} />
          </div>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '16px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Small Tablet (600-899px)
          </h3>
          <div style={{ maxWidth: '600px' }}>
            <MetricCardsContainer metrics={sampleMetrics} />
          </div>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '16px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Mobile (less than 600px)
          </h3>
          <div style={{ maxWidth: '375px' }}>
            <MetricCardsContainer metrics={sampleMetrics} />
          </div>
        </div>
      </div>
    </div>
  ),
};

// Compare grid layouts
export const CompareGridLayouts: StoryObj = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of standard grid layout vs fluid grid layout.'
      }
    }
  },
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}>
        <div>
          <h3 style={{ marginBottom: '16px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Standard Grid Layout (Material UI Grid)
          </h3>
          <div style={{ maxWidth: '1200px' }}>
            <MetricCardsContainer metrics={sampleMetrics} useFluidGrid={false} />
          </div>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '16px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Fluid Grid Layout (CSS Grid)
          </h3>
          <div style={{ maxWidth: '1200px' }}>
            <MetricCardsContainer metrics={sampleMetrics} useFluidGrid={true} />
          </div>
        </div>
      </div>
    </div>
  ),
};