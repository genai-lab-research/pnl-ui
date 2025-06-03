import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { CropDetailModal } from '../../shared/components/ui/CropDetailModal';

const meta: Meta<typeof CropDetailModal> = {
  title: 'Components/CropDetailModal',
  component: CropDetailModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal component for displaying detailed crop information with environmental metrics, timeline controls, and action buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the modal is open',
    },
    containerId: {
      control: 'text',
      description: 'Container ID that contains the crop',
    },
    cropId: {
      control: 'text',
      description: 'Unique identifier for the crop',
    },
    onClose: {
      action: 'onClose',
      description: 'Callback fired when the modal should be closed',
    },
    onProvisionAndPrint: {
      action: 'onProvisionAndPrint',
      description: 'Callback fired when the provision and print button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCropData = {
  id: '20250401-143548-A001',
  seedType: 'Lettuce',
  age: 4,
  imageSrc: '/images/sample-crop.jpg',
  environmentData: {
    areaData: [[0, 0], [50, 0.0002], [100, 0.0003], [150, 0.0004], [200, 0.0004], [250, 0.0012]] as Array<[number, number]>,
    lightData: [[0, 0], [50, 40], [100, 80], [150, 120], [200, 160], [250, 220], [270, 270]] as Array<[number, number]>,
    waterData: [[0, 0], [50, 5], [100, 10], [150, 15], [200, 20], [250, 25], [270, 29]] as Array<[number, number]>,
    airTempData: [[0, 21.0], [50, 20.9], [100, 21.1], [150, 21.0], [200, 21.2], [250, 21.1], [270, 21.2]] as Array<[number, number]>,
    humidityData: [[0, 65], [50, 64], [100, 66], [150, 65], [200, 67], [250, 69], [270, 70]] as Array<[number, number]>,
    co2Data: [[0, 900], [50, 910], [100, 905], [150, 900], [200, 895], [250, 890], [270, 897]] as Array<[number, number]>,
    waterTempData: [[0, 21.0], [50, 20.6], [100, 20.8], [150, 21.0], [200, 20.9], [250, 21.1], [270, 21.1]] as Array<[number, number]>,
    phData: [[0, 6.5], [50, 6.1], [100, 6.3], [150, 6.2], [200, 6.4], [250, 6.3], [270, 6.3]] as Array<[number, number]>,
    ecData: [[0, 1.8], [50, 1.7], [100, 1.9], [150, 1.8], [200, 1.9], [250, 1.8], [270, 1.9]] as Array<[number, number]>,
  },
  generalInfo: {
    'Seed Type': 'Lettuce (Buttercrunch)',
    'Location': 'Tray 5, Row 10, Column 10',
    'Seeded Date': '2025-01-15',
    'Expected Harvest': '2025-02-15',
    'Growth Stage': 'Seedling',
  },
  notes: 'Crop is showing healthy growth patterns. Monitor closely for optimal transplanting timing.',
  history: [
    {
      date: '2025-01-15',
      event: 'Seeded',
      description: 'Initial seeding completed in nursery tray.',
    },
    {
      date: '2025-01-18',
      event: 'Germination',
      description: 'First signs of germination observed.',
    },
    {
      date: '2025-01-22',
      event: 'Growth Update',
      description: 'Healthy seedling development, normal growth rate.',
    },
  ],
};

export const Default: Story = {
  args: {
    open: true,
    containerId: 'container-123',
    cropId: '20250401-143548-A001',
    cropData: sampleCropData,
    onClose: action('onClose'),
    onProvisionAndPrint: action('onProvisionAndPrint'),
  },
};

export const WithMinimalData: Story = {
  args: {
    open: true,
    containerId: 'container-123',
    cropId: '20250401-143548-A002',
    cropData: {
      id: '20250401-143548-A002',
      seedType: 'Basil',
      age: 7,
    },
    onClose: action('onClose'),
    onProvisionAndPrint: action('onProvisionAndPrint'),
  },
};

export const WithoutProvisionButton: Story = {
  args: {
    open: true,
    containerId: 'container-123',
    cropId: '20250401-143548-A003',
    cropData: sampleCropData,
    onClose: action('onClose'),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    containerId: 'container-123',
    cropId: '20250401-143548-A001',
    cropData: sampleCropData,
    onClose: action('onClose'),
    onProvisionAndPrint: action('onProvisionAndPrint'),
  },
};