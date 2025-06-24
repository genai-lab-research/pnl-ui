import React, { useState } from 'react';
import SegmentedButton from '../../shared/components/ui/SegmentedButton';
import { SegmentedButtonOption } from '../../shared/components/ui/SegmentedButton/types';

const SegmentedButtonDemo: React.FC = () => {
  const options: SegmentedButtonOption[] = [
    { value: 'physical', label: 'Physical' },
    { value: 'virtual', label: 'Virtual' },
  ];

  const [selectedValue, setSelectedValue] = useState('physical');

  const handleChange = (value: string) => {
    setSelectedValue(value);
    console.log(`Selected: ${value}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Segmented Button Demo</h2>
      <div className="mb-6">
        <SegmentedButton 
          options={options} 
          value={selectedValue}
          onChange={handleChange}
          ariaLabel="Generation block type"
        />
      </div>
      <div className="mt-4">
        <p>Selected value: <strong>{selectedValue}</strong></p>
      </div>
    </div>
  );
};

export default SegmentedButtonDemo;