import React from 'react';
import { VerticalFarmingGenerationBlock } from '../../../shared/components/ui/VerticalFarmingGenerationBlock';
import { generateGrowthMatrix } from '../../../shared/components/ui/VerticalFarmingGenerationBlock/utils';

const VerticalFarmingGenerationBlockDemo: React.FC = () => {
  return (
    <div style={{ padding: '40px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <VerticalFarmingGenerationBlock
        slotNumber={4}
        trayId="TR-15199256"
        progressPercentage={75}
        gridSize="10×20 Grid"
        cropCount={170}
        growthStatusMatrix={generateGrowthMatrix(12, 21, 75)}
      />
      
      <VerticalFarmingGenerationBlock
        slotNumber={2}
        trayId="TR-98765432"
        progressPercentage={25}
        gridSize="10×20 Grid"
        cropCount={170}
        growthStatusMatrix={generateGrowthMatrix(12, 21, 25)}
      />
      
      <VerticalFarmingGenerationBlock
        slotNumber={6}
        trayId="TR-45678901"
        progressPercentage={95}
        gridSize="10×20 Grid"
        cropCount={170}
        growthStatusMatrix={generateGrowthMatrix(12, 21, 95)}
      />
    </div>
  );
};

export default VerticalFarmingGenerationBlockDemo;