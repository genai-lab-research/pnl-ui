import type { Meta, StoryObj } from '@storybook/react';
import { BreadcrumbLink } from '../BreadcrumbLink';

const meta: Meta<typeof BreadcrumbLink> = {
  title: 'Components/BreadcrumbLink',
  component: BreadcrumbLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof BreadcrumbLink>;

export const Default: Story = {
  args: {
    path: 'Container Management / farm-container-04',
  },
};

export const CustomPath: Story = {
  args: {
    path: 'Dashboard / Statistics / Monthly',
  },
};

export const WithoutSubpath: Story = {
  args: {
    path: 'Container Management',
  },
};