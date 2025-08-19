import React, { useState } from 'react';
import { ContainerTimeSelector } from './ContainerTimeSelector';
import { TimeRangeValue } from '../types/time-range';

/**
 * Example usage of ContainerTimeSelector component
 * 
 * This example demonstrates how to use the ContainerTimeSelector
 * domain component for time range selection in container views.
 */
export const ContainerTimeSelectorExample: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeValue>('month');

  const handleTimeRangeChange = (timeRange: TimeRangeValue) => {
    console.log('Time range changed to:', timeRange);
    setSelectedTimeRange(timeRange);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3>Container Time Selector Examples</h3>
      
      <div>
        <h4>Default Time Selector</h4>
        <ContainerTimeSelector
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          containerId="CONT-001"
        />
      </div>

      <div>
        <h4>Compact Variant</h4>
        <ContainerTimeSelector
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          containerId="CONT-002"
          variant="compact"
          size="sm"
        />
      </div>

      <div>
        <h4>Outlined Variant with Custom Labels</h4>
        <ContainerTimeSelector
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          containerId="CONT-003"
          variant="outlined"
          showLabels={false}
        />
      </div>

      <div>
        <h4>Large Size</h4>
        <ContainerTimeSelector
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          containerId="CONT-004"
          size="lg"
        />
      </div>

      <div>
        <h4>Loading State</h4>
        <ContainerTimeSelector
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          containerId="CONT-005"
          loading={true}
        />
      </div>

      <div>
        <h4>Disabled State</h4>
        <ContainerTimeSelector
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          containerId="CONT-006"
          disabled={true}
        />
      </div>

      <div>
        <h4>With Error</h4>
        <ContainerTimeSelector
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          containerId="CONT-007"
          error="Failed to load time range data"
        />
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <strong>Current Selection:</strong> {selectedTimeRange}
      </div>
    </div>
  );
};

export default ContainerTimeSelectorExample;
