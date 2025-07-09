import type { Meta, StoryObj } from '@storybook/react';
import TemperatureDisplay from '../../shared/components/ui/TemperatureDisplay';

const meta = {
  title: 'UI/TemperatureDisplay',
  component: TemperatureDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentTemperature: { control: { type: 'number' } },
    targetTemperature: { control: { type: 'number' } },
    unit: { control: { type: 'text' } },
  },
} satisfies Meta<typeof TemperatureDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentTemperature: 20,
    targetTemperature: 21,
    unit: '°C',
  },
};

export const Fahrenheit: Story = {
  args: {
    currentTemperature: 68,
    targetTemperature: 70,
    unit: '°F',
  },
};

export const LowTemperature: Story = {
  args: {
    currentTemperature: 15,
    targetTemperature: 18,
    unit: '°C',
  },
};