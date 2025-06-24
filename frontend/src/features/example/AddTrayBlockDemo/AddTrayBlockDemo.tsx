import React from 'react';
import { AddTrayBlock } from '../../../shared/components/ui/AddTrayBlock';

const AddTrayBlockDemo: React.FC = () => {
  const handleAddTrayClick = () => {
    alert('Add Tray clicked!');
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2>Add Tray Block Demo</h2>
      <div style={{ display: 'flex', gap: '24px' }}>
        <AddTrayBlock 
          slotNumber={5} 
          onAddTrayClick={handleAddTrayClick}
        />
        <AddTrayBlock 
          slotNumber={10} 
          onAddTrayClick={handleAddTrayClick}
        />
      </div>
    </div>
  );
};

export default AddTrayBlockDemo;