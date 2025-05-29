import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import BreadcrumbNav from '../../shared/components/ui/BreadcrumbNav';
import { Box } from '@mui/material';

const meta: Meta<typeof BreadcrumbNav> = {
  title: 'Components/BreadcrumbNav',
  component: BreadcrumbNav,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onBackClick: { action: 'back button clicked' },
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '100%', maxWidth: '1200px' }}>
        {Story()}
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BreadcrumbNav>;

/**
 * Default BreadcrumbNav with avatar
 */
export const Default: Story = {
  args: {
    breadcrumb: 'Container Dashboard / farm-container-04',
    avatarSrc: 'https://i.pravatar.cc/300',
    avatarAlt: 'User avatar',
  },
};

/**
 * BreadcrumbNav with long text to demonstrate ellipsis behavior
 */
export const LongText: Story = {
  args: {
    breadcrumb: 'Container Dashboard / farm-container-04 / Very Long Section Name That Should Be Truncated With Ellipsis',
    avatarSrc: 'https://i.pravatar.cc/300',
    avatarAlt: 'User avatar',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * BreadcrumbNav without avatar
 */
export const WithoutAvatar: Story = {
  args: {
    breadcrumb: 'Container Dashboard / farm-container-04',
  },
};

/**
 * BreadcrumbNav on mobile viewport
 */
export const Mobile: Story = {
  args: {
    breadcrumb: 'Container Dashboard / farm-container-04',
    avatarSrc: 'https://i.pravatar.cc/300',
    avatarAlt: 'User avatar',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};