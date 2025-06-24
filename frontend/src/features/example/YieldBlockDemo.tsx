import React from 'react';
import { YieldBlock } from '../../shared/components/ui/YieldBlock';

export const YieldBlockDemo: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <h2>YieldBlock Component Demo</h2>
      <div style={{ marginTop: '20px' }}>
        <YieldBlock value="51KG" increment="+1.5Kg" />
      </div>
    </div>
  );
};

export default YieldBlockDemo;