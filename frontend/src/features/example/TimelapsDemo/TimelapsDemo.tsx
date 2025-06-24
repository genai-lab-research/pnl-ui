import React from 'react';
import { Timelaps } from '../../../shared/components/ui/Timelaps';
import { TimelapsCellData } from '../../../shared/components/ui/Timelaps/types';

const TimelapsDemo: React.FC = () => {
  // Generate sample data for the component - 62 cells as per design
  const generateCells = (): TimelapsCellData[] => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30); // 30 days ago
    
    return Array(62).fill(null).map((_, index) => {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + index);
      
      return {
        isActive: index <= 30, // First 31 cells are active (including today)
        isFuture: index > 30,  // Remaining cells are future cells
        date: cellDate
      };
    });
  };

  const cells = generateCells();
  
  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Timelaps Component Demo</h1>
      <div style={{ marginTop: '40px' }}>
        <h2>Default Timelaps</h2>
        <Timelaps
          cells={cells}
          startDate="05 Apr"
          endDate="06 Jun"
        />
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Timelaps with Today Tooltip</h2>
        <Timelaps
          cells={cells}
          startDate="05 Apr"
          endDate="06 Jun"
          currentDayIndex={30}
        />
      </div>
    </div>
  );
};

export default TimelapsDemo;