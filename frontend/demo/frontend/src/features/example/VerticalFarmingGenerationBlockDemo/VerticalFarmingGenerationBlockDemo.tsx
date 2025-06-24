import React from 'react';
import { VerticalFarmingGenerationBlock } from '../../../shared/components/VerticalFarmingGenerationBlock';
import styled from '@emotion/styled';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
`;

const VerticalFarmingGenerationBlockDemo: React.FC = () => {
  return (
    <DemoContainer>
      <h1>Vertical Farming Generation Block Demo</h1>
      
      <div>
        <h2>Default Example</h2>
        <VerticalFarmingGenerationBlock
          areaLabel="Area"
          areaUnit="m²"
          leftValue="0.0"
          rightValue="0.0012"
          alertValue="0.0004"
          graphData={[0.0002, 0.0003, 0.0004, 0.0006, 0.0008, 0.0010, 0.0012]}
        />
      </div>
      
      <div>
        <h2>Without Alert</h2>
        <VerticalFarmingGenerationBlock
          areaLabel="Area"
          areaUnit="m²"
          leftValue="0.0"
          rightValue="0.0012"
          graphData={[0.0002, 0.0003, 0.0004, 0.0006, 0.0008, 0.0010, 0.0012]}
        />
      </div>
      
      <div>
        <h2>Different Values</h2>
        <VerticalFarmingGenerationBlock
          areaLabel="Zone"
          areaUnit="km²"
          leftValue="1.2"
          rightValue="3.4"
          alertValue="2.5"
          graphData={[1.2, 1.5, 1.8, 2.2, 2.7, 3.1, 3.4]}
        />
      </div>
    </DemoContainer>
  );
};

export default VerticalFarmingGenerationBlockDemo;