import React from 'react';
import { 
  Container, 
  HeaderWrapper, 
  SlotBadge, 
  TrayInfo,
  ProgressBar, 
  GridContainer, 
  DotGrid,
  Dot,
  FooterText,
  GridStats
} from './styles';
import { GridViewTrayCropsProps } from './types';

/**
 * GridViewTrayCrops Component
 * 
 * A vertical farming tray visualization showing crops as dots in a grid pattern.
 * Green dots represent healthy crops, gray dots represent empty slots.
 */
export const GridViewTrayCrops: React.FC<GridViewTrayCropsProps> = ({ 
  slotNumber = 1,
  trayId = "TR-15199256",
  progressPercentage = 75,
  gridRows = 20,
  gridColumns = 10,
  totalCrops = 170,
  className 
}) => {
  const totalSlots = gridRows * gridColumns;
  const filledSlots = Math.floor((totalCrops / totalSlots) * totalSlots);
  
  const renderDots = () => {
    const dots = [];
    
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridColumns; col++) {
        const index = row * gridColumns + col;
        const isHealthy = index < filledSlots;
        
        dots.push(
          <Dot 
            key={`${row}-${col}`} 
            $isHealthy={isHealthy}
          />
        );
      }
    }
    
    return dots;
  };

  return (
    <Container className={className}>
      <HeaderWrapper>
        <SlotBadge>SLOT {slotNumber}</SlotBadge>
        <TrayInfo>
          <span>{trayId}</span>
          <span>{progressPercentage}%</span>
        </TrayInfo>
        <ProgressBar $progress={progressPercentage} />
      </HeaderWrapper>
      
      <GridContainer>
        <DotGrid $columns={gridColumns}>
          {renderDots()}
        </DotGrid>
        
        <FooterText>
          <GridStats>{gridColumns}x{gridRows} Grid</GridStats>
          <GridStats>{totalCrops} crops</GridStats>
        </FooterText>
      </GridContainer>
    </Container>
  );
};