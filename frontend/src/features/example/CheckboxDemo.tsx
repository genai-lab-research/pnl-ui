import * as React from 'react';
import { useState } from 'react';
import { Checkbox } from '../../shared/components/ui/Checkbox';

const CheckboxDemo: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Checkbox Component Demo</h2>
      <div style={{ marginBottom: '20px' }}>
        <h3>Default Checkbox</h3>
        <Checkbox 
          checked={isChecked} 
          onChange={handleChange} 
        />
        <p>Checkbox is {isChecked ? 'checked' : 'unchecked'}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Initially Checked Checkbox</h3>
        <Checkbox defaultChecked />
      </div>
      
      <div>
        <h3>Disabled Checkbox</h3>
        <Checkbox disabled />
      </div>
    </div>
  );
};

export default CheckboxDemo;