import React from 'react';
import {
  Container,
  AreaLabelPanel,
  AreaText,
  AreaUnitText,
  ValuePanel,
  ValueText,
  GraphPanel,
  AlertBubbleContainer,
  BlueDot,
  BubbleContainer,
  BubbleText
} from './styles';
import { VerticalFarmingGenerationBlockProps } from './types';
import { Chart } from './components';

/**
 * VerticalFarmingGenerationBlock Component
 * 
 * A compact, vertically-stacked status/control block used inside the vertical-farming dashboard.
 * It shows the growing‐area label, live graph, current reading values and an alert/tooltip bubble.
 */
export const VerticalFarmingGenerationBlock: React.FC<VerticalFarmingGenerationBlockProps> = ({
  areaLabel,
  areaUnit,
  leftValue,
  rightValue,
  alertValue,
  graphData,
  className
}) => {
  return (
    <Container className={className}>
      <AreaLabelPanel>
        <AreaText>{areaLabel}</AreaText>
        <AreaUnitText>{areaUnit}</AreaUnitText>
      </AreaLabelPanel>
      
      <ValuePanel>
        <ValueText>{leftValue}</ValueText>
      </ValuePanel>
      
      <GraphPanel>
        <Chart data={graphData} />
      </GraphPanel>
      
      <ValuePanel>
        <ValueText>{rightValue}</ValueText>
      </ValuePanel>
      
      {alertValue && (
        <AlertBubbleContainer>
          <BlueDot />
          <BubbleContainer>
            <BubbleText>{alertValue}</BubbleText>
          </BubbleContainer>
        </AlertBubbleContainer>
      )}
    </Container>
  );
};