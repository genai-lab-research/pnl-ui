import React from 'react';
import { VerticalFarmingGenerationTimelineBlock } from '../../../shared/components/ui/VerticalFarmingGenerationTimelineBlock';

const VerticalFarmingGenerationTimelineBlockDemo: React.FC = () => {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <h2>Vertical Farming Generation Timeline Block</h2>
      
      <div style={{ marginTop: '20px' }}>
        <VerticalFarmingGenerationTimelineBlock 
          data={Array(16).fill(0)}
          startDateLabel="01 Apr"
          endDateLabel="15 Apr"
          tooltipDate="April 4"
          selectedBarIndices={[3, 4, 14]}
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <VerticalFarmingGenerationTimelineBlock 
          data={Array(16).fill(0)}
          startDateLabel="15 May"
          endDateLabel="30 May"
          tooltipDate="May 20"
          selectedBarIndices={[5, 6, 7]}
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <VerticalFarmingGenerationTimelineBlock 
          data={Array(16).fill(0)}
          startDateLabel="01 Jun"
          endDateLabel="15 Jun"
          selectedBarIndices={[0, 1, 8, 9]}
        />
      </div>
    </div>
  );
};

export default VerticalFarmingGenerationTimelineBlockDemo;