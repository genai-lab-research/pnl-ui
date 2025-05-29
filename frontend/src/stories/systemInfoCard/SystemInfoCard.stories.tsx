import { Meta, StoryObj } from '@storybook/react';
import { SystemInfoCard } from '../../shared/components/ui/SystemInfoCard';

const meta: Meta<typeof SystemInfoCard> = {
  title: 'Components/SystemInfoCard',
  component: SystemInfoCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the card',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle or description of the card',
    },
    groups: {
      control: 'object',
      description: 'Groups of settings to display',
    },
    noBorder: {
      control: 'boolean',
      description: 'Whether to remove the border from the card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SystemInfoCard>;

export const Default: Story = {
  args: {
    title: 'System Settings',
    subtitle: 'Create or deactivate a digital shadow for farm-container-04.',
    groups: [
      {
        title: 'Container Options',
        items: [
          { name: 'Enable Shadow Service', value: 'No' },
        ],
      },
      {
        title: 'System Integration',
        items: [
          { name: 'Connect to external systems', value: 'Yes' },
          { 
            name: 'FA Integration', 
            value: 'Alpha', 
            isLink: true,
            linkUrl: '#' 
          },
          { 
            name: 'FA Integration', 
            value: 'Dev', 
            isLink: true,
            linkUrl: '#' 
          },
          { 
            name: 'AWS Environment', 
            value: 'Dev', 
            isLink: true,
            linkUrl: '#' 
          },
          { 
            name: 'MBAI Environment', 
            value: 'Disabled', 
            isLink: true,
            linkUrl: '#' 
          },
        ],
      },
    ],
  },
};

export const WithoutBorder: Story = {
  args: {
    ...Default.args,
    noBorder: true,
  },
};

export const MultipleGroups: Story = {
  args: {
    title: 'Farm System Settings',
    subtitle: 'Configure farm settings and external integrations.',
    groups: [
      {
        title: 'Container Options',
        items: [
          { name: 'Enable Shadow Service', value: 'Yes' },
          { name: 'Remote Monitoring', value: 'Active' },
          { name: 'Data Collection', value: 'Enabled' },
        ],
      },
      {
        title: 'System Integration',
        items: [
          { name: 'Connect to external systems', value: 'Yes' },
          { 
            name: 'Farm Analytics', 
            value: 'Production', 
            isLink: true,
            linkUrl: '#' 
          },
        ],
      },
      {
        title: 'Environment Settings',
        items: [
          { name: 'Temperature Control', value: 'Automated' },
          { name: 'Humidity Regulation', value: 'Manual' },
          { name: 'Light Cycle', value: '16/8' },
        ],
      },
    ],
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: Default.args,
};