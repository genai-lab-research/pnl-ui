import type { Meta, StoryObj } from '@storybook/react';
import { ContainerSettingsPanel } from './ContainerSettingsPanel';
import { ContainerSettings } from './types';

const meta: Meta<typeof ContainerSettingsPanel> = {
  title: 'UI/ContainerSettingsPanel',
  component: ContainerSettingsPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultSettings: ContainerSettings = {
  shadowServiceEnabled: false,
  externalSystemsConnected: true,
  faIntegration: 'Alpha',
  awsEnvironment: 'Dev',
  mbaiEnvironment: 'Disabled',
};

export const Default: Story = {
  args: {
    settings: defaultSettings,
    onSettingChange: (key: string, value: boolean | string) => {
      console.log(`Setting changed - ${key}:`, value);
    },
  },
};

export const ReadOnly: Story = {
  args: {
    settings: defaultSettings,
    readOnly: true,
  },
};

export const AllEnabled: Story = {
  args: {
    settings: {
      shadowServiceEnabled: true,
      externalSystemsConnected: true,
      faIntegration: 'Production',
      awsEnvironment: 'Production',
      mbaiEnvironment: 'Enabled',
    },
    onSettingChange: (key: string, value: boolean | string) => {
      console.log(`Setting changed - ${key}:`, value);
    },
  },
};

export const CustomTitle: Story = {
  args: {
    settings: defaultSettings,
    title: 'Container Configuration',
    onSettingChange: (key: string, value: boolean | string) => {
      console.log(`Setting changed - ${key}:`, value);
    },
  },
};