import type { Meta, StoryObj } from '@storybook/react';
import { GrowthStageImage } from '../../shared/components/ui/GrowthStageImage';

const meta: Meta<typeof GrowthStageImage> = {
  title: 'UI/GrowthStageImage',
  component: GrowthStageImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    imageSrc: { control: 'text' },
    age: { control: 'text' },
    width: { control: 'text' },
    height: { control: 'text' },
    borderRadius: { control: 'text' },
    alt: { control: 'text' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof GrowthStageImage>;

// Use the placeholder image from the sample JSON
const sampleImageSrc = '/assets/placeholder-seedling.jpg';

export const Default: Story = {
  args: {
    imageSrc: sampleImageSrc,
    age: '15d',
    width: 150,
    height: 150,
  },
};

export const NoAge: Story = {
  args: {
    imageSrc: sampleImageSrc,
    width: 150,
    height: 150,
  },
};

export const RoundedCorners: Story = {
  args: {
    imageSrc: sampleImageSrc,
    age: '15d',
    width: 150,
    height: 150,
    borderRadius: 16,
  },
};

export const Small: Story = {
  args: {
    imageSrc: sampleImageSrc,
    age: '15d',
    width: 80,
    height: 80,
  },
};

export const Large: Story = {
  args: {
    imageSrc: sampleImageSrc,
    age: '15d',
    width: 250,
    height: 250,
  },
};