import React from 'react';
import MediaControlButtonSet from '../../../shared/components/ui/MediaControlButtonSet';

const MediaControlButtonSetDemo: React.FC = () => {
  const handlePreviousClick = () => {
    console.log('Previous button clicked');
  };

  const handlePlayClick = () => {
    console.log('Play button clicked');
  };

  const handleRepeatClick = () => {
    console.log('Repeat button clicked');
  };

  const handleNextClick = () => {
    console.log('Next button clicked');
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2>Media Control Button Set Demo</h2>
      
      <div>
        <h3>Default</h3>
        <MediaControlButtonSet
          onPreviousClick={handlePreviousClick}
          onPlayClick={handlePlayClick}
          onRepeatClick={handleRepeatClick}
          onNextClick={handleNextClick}
        />
      </div>
      
      <div>
        <h3>Disabled</h3>
        <MediaControlButtonSet
          onPreviousClick={handlePreviousClick}
          onPlayClick={handlePlayClick}
          onRepeatClick={handleRepeatClick}
          onNextClick={handleNextClick}
          disabled
        />
      </div>
    </div>
  );
};

export default MediaControlButtonSetDemo;