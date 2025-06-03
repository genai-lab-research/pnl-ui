import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FooterContainer } from '../../shared/components/ui/FooterContainer';
import { Box } from '@mui/material';

const meta: Meta<typeof FooterContainer> = {
  title: 'UI/FooterContainer',
  component: FooterContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FooterContainer>;

/**
 * Default display of the FooterContainer with standard options.
 */
export const Default: Story = {
  args: {
    primaryActionLabel: 'Provision & Print ID',
    secondaryActionLabel: 'Close',
    onPrimaryAction: () => console.log('Primary action clicked'),
    onSecondaryAction: () => console.log('Secondary action clicked'),
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '600px' }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * Only showing the Close button without primary action.
 */
export const OnlySecondaryAction: Story = {
  args: {
    secondaryActionLabel: 'Close',
    onSecondaryAction: () => console.log('Secondary action clicked'),
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '600px' }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * Only showing the primary action button without secondary action.
 */
export const OnlyPrimaryAction: Story = {
  args: {
    primaryActionLabel: 'Provision & Print ID',
    onPrimaryAction: () => console.log('Primary action clicked'),
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '600px' }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * FooterContainer with disabled buttons.
 */
export const DisabledActions: Story = {
  args: {
    primaryActionLabel: 'Provision & Print ID',
    secondaryActionLabel: 'Close',
    onPrimaryAction: () => console.log('Primary action clicked'),
    onSecondaryAction: () => console.log('Secondary action clicked'),
    primaryActionDisabled: true,
    secondaryActionDisabled: true,
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '600px' }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * FooterContainer with additional content.
 */
export const WithAdditionalContent: Story = {
  args: {
    primaryActionLabel: 'Provision & Print ID',
    secondaryActionLabel: 'Close',
    onPrimaryAction: () => console.log('Primary action clicked'),
    onSecondaryAction: () => console.log('Secondary action clicked'),
    children: (
      <Box sx={{ color: 'text.secondary', fontSize: '14px' }}>
        Additional information can be displayed here
      </Box>
    ),
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '700px' }}>
        <Story />
      </Box>
    ),
  ],
};