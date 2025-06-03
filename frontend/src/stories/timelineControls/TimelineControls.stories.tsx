import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { TimelineControls, PlayState } from '../../shared/components/ui/TimelineControls';

// Create wrapper component for interactive state management
const TimelineControlsExample = () => {
  const [playState, setPlayState] = useState<PlayState>('paused');

  const handlePlayPause = () => {
    setPlayState(prevState => prevState === 'playing' ? 'paused' : 'playing');
  };

  return (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <TimelineControls
        playState={playState}
        onPlayPauseClick={handlePlayPause}
        onPreviousClick={() => console.log('Previous clicked')}
        onNextClick={() => console.log('Next clicked')}
        onRepeatClick={() => console.log('Repeat clicked')}
      />
    </Box>
  );
};

// Create component with disabled state
const TimelineControlsDisabled = () => {
  return (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <TimelineControls
        playState="paused"
        disabled
      />
    </Box>
  );
};

// Create component with playing state
const TimelineControlsPlaying = () => {
  return (
    <Box sx={{ width: '400px', maxWidth: '100%', p: 2, bgcolor: 'white' }}>
      <TimelineControls
        playState="playing"
        onPlayPauseClick={() => console.log('Play/Pause clicked')}
        onPreviousClick={() => console.log('Previous clicked')}
        onNextClick={() => console.log('Next clicked')}
        onRepeatClick={() => console.log('Repeat clicked')}
      />
    </Box>
  );
};

const meta: Meta<typeof TimelineControls> = {
  title: 'UI/TimelineControls',
  component: TimelineControls,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    playState: {
      control: { type: 'radio' },
      options: ['playing', 'paused'],
      description: 'Current play state',
    },
    onPlayPauseClick: {
      description: 'Callback fired when play/pause button is clicked',
    },
    onPreviousClick: {
      description: 'Callback fired when previous button is clicked',
    },
    onNextClick: {
      description: 'Callback fired when next button is clicked',
    },
    onRepeatClick: {
      description: 'Callback fired when repeat button is clicked',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'If true, will disable all controls',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineControls>;

export const Default: Story = {
  render: () => <TimelineControlsExample />
};

export const Disabled: Story = {
  render: () => <TimelineControlsDisabled />
};

export const Playing: Story = {
  render: () => <TimelineControlsPlaying />
};