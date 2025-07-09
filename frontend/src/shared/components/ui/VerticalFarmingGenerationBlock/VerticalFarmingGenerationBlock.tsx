import React from 'react';
import {
  Container,
  SlotLabel,
  SlotLabelText,
  CardContainer,
  HeaderRow,
  TrayIdText,
  ProgressText,
  ProgressBarContainer,
  ProgressBarFill,
  TimelineContainer,
  TimelineRow,
  StatusDot,
  FooterRow,
  GridSizeText,
  CropCountText
} from './styles';
import { VerticalFarmingGenerationBlockProps } from './types';

export const VerticalFarmingGenerationBlock: React.FC<VerticalFarmingGenerationBlockProps> = ({
  slotNumber,
  trayId,
  progressPercentage,
  gridSize,
  cropCount,
  growthStatusMatrix,
  className
}) => {
  return (
    <Container className={className}>
      <SlotLabel>
        <SlotLabelText>Slot {slotNumber}</SlotLabelText>
      </SlotLabel>
      
      <CardContainer>
        <HeaderRow>
          <TrayIdText>{trayId}</TrayIdText>
          <ProgressText>{progressPercentage} %</ProgressText>
        </HeaderRow>
        
        <ProgressBarContainer>
          <ProgressBarFill percentage={progressPercentage} />
        </ProgressBarContainer>
        
        <TimelineContainer>
          {growthStatusMatrix.map((row, rowIndex) => (
            <TimelineRow key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <StatusDot 
                  key={`cell-${rowIndex}-${cellIndex}`}
                  status={cell.status} 
                />
              ))}
            </TimelineRow>
          ))}
        </TimelineContainer>
        
        <FooterRow>
          <GridSizeText>{gridSize}</GridSizeText>
          <CropCountText>{cropCount} crops</CropCountText>
        </FooterRow>
      </CardContainer>
    </Container>
  );
};