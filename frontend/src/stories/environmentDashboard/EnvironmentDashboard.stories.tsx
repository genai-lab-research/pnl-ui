import type { Meta, StoryObj } from '@storybook/react';
import { EnvironmentDashboard } from '../../shared/components/ui/EnvironmentDashboard';

const meta: Meta<typeof EnvironmentDashboard> = {
  title: 'UI/EnvironmentDashboard',
  component: EnvironmentDashboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    areaData: { control: 'object' },
    lightData: { control: 'object' },
    waterData: { control: 'object' },
    airTempData: { control: 'object' },
    humidityData: { control: 'object' },
    co2Data: { control: 'object' },
    waterTempData: { control: 'object' },
    phData: { control: 'object' },
    ecData: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof EnvironmentDashboard>;

// Sample data for charts
const areaData = [[0, 0], [50, 0.0006], [100, 0.0009], [150, 0.0010], [200, 0.0011], [250, 0.0012]];
const lightData = [[0, 0], [50, 40], [100, 80], [150, 120], [200, 160], [250, 220], [270, 270]];
const waterData = [[0, 0], [50, 5], [100, 10], [150, 15], [200, 20], [250, 25], [270, 29]];
const airTempData = [[0, 21.0], [50, 21.1], [100, 21.1], [150, 21.0], [200, 21.2], [250, 21.1], [270, 21.2]];
const humidityData = [[0, 65], [50, 67], [100, 68], [150, 69], [200, 69], [250, 70], [270, 70.1]];
const co2Data = [[0, 900], [50, 897], [100, 899], [150, 900], [200, 896], [250, 898], [270, 897]];
const waterTempData = [[0, 21.0], [50, 21.0], [100, 21.1], [150, 21.0], [200, 21.1], [250, 21.0], [270, 21.1]];
const phData = [[0, 6.5], [50, 6.4], [100, 6.3], [150, 6.3], [200, 6.3], [250, 6.3], [270, 6.3]];
const ecData = [[0, 1.8], [50, 1.8], [100, 1.9], [150, 1.8], [200, 1.9], [250, 1.8], [270, 1.9]];

export const Default: Story = {
  args: {
    width: '400px',
    areaData,
    lightData,
    waterData,
    airTempData,
    humidityData,
    co2Data,
    waterTempData,
    phData,
    ecData,
  },
};

export const Narrow: Story = {
  args: {
    width: '300px',
    areaData,
    lightData,
    waterData,
    airTempData,
    humidityData,
    co2Data,
    waterTempData,
    phData,
    ecData,
  },
};

export const Wide: Story = {
  args: {
    width: '600px',
    areaData,
    lightData,
    waterData,
    airTempData,
    humidityData,
    co2Data,
    waterTempData,
    phData,
    ecData,
  },
};