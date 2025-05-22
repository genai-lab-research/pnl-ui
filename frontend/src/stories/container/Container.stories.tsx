import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { Container } from '../../shared/components/ui/Container/Container';
import { Box, Typography } from '@mui/material';

const meta: Meta<typeof Container> = {
  title: 'Container/Container',
  component: Container,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: (
      <Typography variant="body1">
        This is a basic container with default styling.
      </Typography>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <Typography variant="body1">
        This container has an outlined border.
      </Typography>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <Typography variant="body1">
        This container has elevation shadow.
      </Typography>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'large',
    children: (
      <Typography variant="body1">
        This container has large padding.
      </Typography>
    ),
  },
};

export const SmallPadding: Story = {
  args: {
    padding: 'small',
    children: (
      <Typography variant="body1">
        This container has small padding.
      </Typography>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <Box className="bg-gray-100 p-4">
        <Typography variant="body1">
          This container has no padding, so this content has its own padding.
        </Typography>
      </Box>
    ),
  },
};

export const CustomBackground: Story = {
  args: {
    backgroundColor: '#f8f9fa',
    children: (
      <Typography variant="body1">
        This container has a custom background color.
      </Typography>
    ),
  },
};

export const Nested: Story = {
  args: {
    children: (
      <Box className="space-y-4">
        <Typography variant="h6" className="mb-2">Container with nested containers</Typography>
        <Container padding="small" backgroundColor="#f8f9fa">
          <Typography variant="body2">This is a nested small container</Typography>
        </Container>
        <Container padding="small" backgroundColor="#e9ecef">
          <Typography variant="body2">This is another nested small container</Typography>
        </Container>
      </Box>
    ),
  },
};