import React from 'react';
import TemperatureDisplay from '../../shared/components/ui/TemperatureDisplay';

const TemperatureDisplayDemo: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Temperature Display Component</h2>
      <div style={{ marginTop: '20px' }}>
        <TemperatureDisplay 
          currentTemperature={20} 
          targetTemperature={21}
        />
      </div>
    </div>
  );
};

export default TemperatureDisplayDemo;