import type { Meta, StoryObj } from '@storybook/react';
import { Button, Box, Typography, Grid } from '@mui/material';

import { Tooltip } from '../../shared/components/ui/Tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '3rem' }}>
        {Story()}
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic example of the Tooltip component with default settings.
 * This matches the design in component_429-20129.json.
 */
export const Default: Story = {
  args: {
    title: '2 days',
    arrow: true,
    placement: 'bottom',
    children: <Button variant="contained">Hover me</Button>,
  },
};

/**
 * Tooltip with a longer description to demonstrate text wrapping behavior.
 */
export const WithLongText: Story = {
  args: {
    title: 'This is a longer tooltip that demonstrates how the text wraps when it exceeds the maximum width.',
    arrow: true,
    placement: 'bottom',
    children: <Button variant="contained">Hover for long text</Button>,
  },
};

/**
 * Examples of tooltips with different placement options.
 */
export const Placements: Story = {
  args: {
    title: 'Tooltip with various placements',
    children: <Button variant="outlined">Hover me</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can be placed in different positions: top, right, bottom, left.'
      }
    }
  },
  decorators: [
    (Story) => (
      <Grid container spacing={4} alignItems="center" justifyContent="center" style={{ height: '300px' }}>
        <Grid item xs={4} container justifyContent="center">
          <Tooltip title="Top placement" placement="top" arrow>
            <Button variant="outlined">Top</Button>
          </Tooltip>
        </Grid>
        <Grid item xs={4} container justifyContent="center">
          <Tooltip title="Right placement" placement="right" arrow>
            <Button variant="outlined">Right</Button>
          </Tooltip>
        </Grid>
        <Grid item xs={4} container justifyContent="center">
          <Tooltip title="Bottom placement" placement="bottom" arrow>
            <Button variant="outlined">Bottom</Button>
          </Tooltip>
        </Grid>
        <Grid item xs={4} container justifyContent="center">
          <Tooltip title="Left placement" placement="left" arrow>
            <Button variant="outlined">Left</Button>
          </Tooltip>
        </Grid>
      </Grid>
    ),
  ],
};

/**
 * Example of a tooltip without an arrow.
 */
export const NoArrow: Story = {
  args: {
    title: 'Tooltip without arrow',
    arrow: false,
    placement: 'bottom',
    children: <Button variant="contained">No arrow</Button>,
  },
};

/**
 * Example of a controlled tooltip that is always visible.
 */
export const AlwaysOpen: Story = {
  args: {
    title: 'This tooltip is always visible',
    arrow: true,
    placement: 'bottom',
    open: true,
    children: <Button variant="contained">Always visible</Button>,
  },
};

/**
 * Example of tooltips on different elements.
 */
export const DifferentTriggers: Story = {
  args: {
    title: 'Tooltip on different elements',
    children: <Button variant="contained">Button with tooltip</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can be applied to various elements like buttons, text, and icons.'
      }
    }
  },
  decorators: [
    (Story) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Tooltip title="Tooltip on a button">
          <Button variant="contained">Button with tooltip</Button>
        </Tooltip>

        <Tooltip title="Tooltip on text">
          <Typography component="span" style={{ cursor: 'help' }}>
            Hover over this text to see tooltip
          </Typography>
        </Tooltip>

        <Tooltip title="Tooltip on an icon">
          <span role="button" style={{ display: 'inline-block', cursor: 'pointer' }}>
            ℹ️
          </span>
        </Tooltip>
      </Box>
    ),
  ],
};

/**
 * Example showing tooltip with different delays.
 */
export const WithCustomDelays: Story = {
  args: {
    title: "Tooltip with custom delays",
    enterDelay: 500,
    leaveDelay: 500,
    children: <Button variant="outlined">Custom delays</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tooltips can have custom enter and leave delay timings.'
      }
    }
  },
  decorators: [
    (Story) => (
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Tooltip title="Quick to appear (100ms)" enterDelay={100} leaveDelay={500}>
          <Button variant="outlined">Fast enter, slow leave</Button>
        </Tooltip>

        <Tooltip title="Slow to appear (1000ms)" enterDelay={1000} leaveDelay={100}>
          <Button variant="outlined">Slow enter, fast leave</Button>
        </Tooltip>
      </Box>
    ),
  ],
};

/**
 * Example showing interactive tooltip that can be hovered.
 */
export const Interactive: Story = {
  args: {
    title: 'You can hover over me without me disappearing!',
    arrow: true,
    placement: 'bottom',
    disableInteractive: false,
    children: <Button variant="contained">Interactive tooltip</Button>,
  },
};