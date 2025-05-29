import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../styles/theme';
import { TotalContainerIndicator } from '../../shared/components/ui/TotalContainerIndicator';

const meta: Meta<typeof TotalContainerIndicator> = {
  title: 'Components/TotalContainerIndicator',
  component: TotalContainerIndicator,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <div style={{ maxWidth: '400px', padding: '24px', backgroundColor: '#F7F9FD' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The TotalContainerIndicator component displays a count of total containers in a card format.
It features a label "Total Containers" and a prominent number display.

## Features
- Clean, minimalist design
- Responsive layout
- Customizable value
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'The total count to display',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: 1 },
      },
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class name',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TotalContainerIndicator>;

// Default story with default value
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default TotalContainerIndicator with value of 1.',
      },
    },
  },
};

// Story with a custom value
export const CustomValue: Story = {
  args: {
    value: 42,
  },
  parameters: {
    docs: {
      description: {
        story: 'TotalContainerIndicator with a custom value.',
      },
    },
  },
};

// Story with a large value
export const LargeValue: Story = {
  args: {
    value: 1234,
  },
  parameters: {
    docs: {
      description: {
        story: 'TotalContainerIndicator with a large value to show how it handles space constraints.',
      },
    },
  },
};

// Story to show responsiveness
export const Responsive: Story = {
  args: {
    value: 8,
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <div style={{ width: '100%', maxWidth: '600px', padding: '24px', backgroundColor: '#F7F9FD' }}>
          <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <Story />
            </div>
            <div style={{ width: '100%', maxWidth: '200px', marginLeft: '16px' }}>
              <Story />
            </div>
          </div>
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates how the component responds to different container widths.',
      },
    },
  },
};