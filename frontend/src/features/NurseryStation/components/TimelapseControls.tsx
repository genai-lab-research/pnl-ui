import React from 'react';
import { Box, Typography, Paper, Slider, IconButton } from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Pause as PauseIcon,
  SkipPrevious as PrevIcon,
  SkipNext as NextIcon 
} from '@mui/icons-material';
import { TimelapseControlsProps } from '../types';

/**
 * Time-lapse controls for navigating through historical and future nursery states
 */
export const TimelapseControls: React.FC<TimelapseControlsProps> = ({
  selectedDate,
  onDateChange,
  snapshots
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Create date range (±14 days from today)
  const today = new Date();
  
  const { startDate, endDate } = React.useMemo(() => {
    const start = new Date(today);
    start.setDate(today.getDate() - 14);
    const end = new Date(today);
    end.setDate(today.getDate() + 14);
    return { startDate: start, endDate: end };
  }, [today.getTime()]);

  // Generate date array for timeline
  const dateArray = React.useMemo(() => {
    const dates = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [startDate, endDate]);

  // Find current index based on selected date
  React.useEffect(() => {
    const index = dateArray.findIndex(date => 
      date.toDateString() === selectedDate.toDateString()
    );
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [selectedDate, dateArray]);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const index = newValue as number;
    setCurrentIndex(index);
    onDateChange(dateArray[index]);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onDateChange(dateArray[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentIndex < dateArray.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onDateChange(dateArray[newIndex]);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (isPlaying && currentIndex < dateArray.length - 1) {
      const timer = setTimeout(() => {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        onDateChange(dateArray[newIndex]);
      }, 1000); // 1 second per frame
      return () => clearTimeout(timer);
    } else if (isPlaying && currentIndex === dateArray.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentIndex, dateArray.length, dateArray, onDateChange]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isToday = selectedDate.toDateString() === today.toDateString();
  const isFuture = selectedDate > today;

  return (
    <Paper className="p-6">
      <Typography variant="h6" className="mb-4 text-steel-smoke font-semibold">
        Time-lapse Navigation
      </Typography>
      
      {/* Date Display */}
      <Box className="text-center mb-4">
        <Typography variant="h5" className="font-bold text-steel-smoke">
          {formatDate(selectedDate)}
        </Typography>
        <Typography variant="body2" className="text-silver-polish">
          {isToday ? 'Current State' : isFuture ? 'Predicted State' : 'Historical State'}
        </Typography>
      </Box>

      {/* Timeline Slider */}
      <Box className="mb-4 px-4">
        <Slider
          value={currentIndex}
          onChange={handleSliderChange}
          min={0}
          max={dateArray.length - 1}
          marks={dateArray.map((date, index) => ({
            value: index,
            label: index % 7 === 0 ? formatDate(date) : ''
          }))}
          valueLabelDisplay="off"
          className="text-lilac-haze"
        />
      </Box>

      {/* Control Buttons */}
      <Box className="flex justify-center items-center space-x-2">
        <IconButton 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="text-steel-smoke"
        >
          <PrevIcon />
        </IconButton>
        
        <IconButton 
          onClick={handlePlayPause}
          className="text-steel-smoke"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        
        <IconButton 
          onClick={handleNext}
          disabled={currentIndex === dateArray.length - 1}
          className="text-steel-smoke"
        >
          <NextIcon />
        </IconButton>
      </Box>

      {/* Snapshot Status */}
      {snapshots.length > 0 && (
        <Box className="mt-4 text-center">
          <Typography variant="caption" className="text-silver-polish">
            {snapshots.length} snapshots available for this period
          </Typography>
        </Box>
      )}
    </Paper>
  );
};