import React, { useState } from 'react';
import { TextInput } from '../../shared/components/ui/TextInput';

const TextInputDemo: React.FC = () => {
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">TextInput Demo</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Default TextInput</h3>
          <TextInput
            placeholder="Notes (optional)"
            value={value}
            onChange={handleChange}
          />
          <p className="mt-2 text-sm">Current value: {value || '(empty)'}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Disabled TextInput</h3>
          <TextInput
            placeholder="Disabled input"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default TextInputDemo;