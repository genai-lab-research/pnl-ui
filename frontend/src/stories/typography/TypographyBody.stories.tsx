import type { Meta, StoryObj } from '@storybook/react';
import { TypographyBody } from '../../shared/components/ui/Typography';

const meta = {
  title: 'UI/Typography/TypographyBody',
  component: TypographyBody,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      options: ['default', 'primary', 'secondary', 'muted', 'error', 'success'],
      control: { type: 'select' },
    },
    align: {
      options: ['left', 'center', 'right'],
      control: { type: 'radio' },
    },
    gutterBottom: { control: 'boolean' },
  },
} satisfies Meta<typeof TypographyBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a standard body text paragraph used throughout the application.',
    color: 'default',
    align: 'left',
    gutterBottom: false,
  },
};

export const Primary: Story = {
  args: {
    children: 'This is body text in primary color.',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'This is body text in secondary color.',
    color: 'secondary',
  },
};

export const Muted: Story = {
  args: {
    children: 'This is muted body text, used for less important information.',
    color: 'muted',
  },
};

export const WithGutterBottom: Story = {
  args: {
    children: 'This paragraph has a margin bottom applied.',
    gutterBottom: true,
  },
};

export const CenteredText: Story = {
  args: {
    children: 'This text is center aligned.',
    align: 'center',
  },
};