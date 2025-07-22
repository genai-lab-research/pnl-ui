import React, { useMemo } from 'react';
import { 
  Container, 
  TopStack, 
  SlotBadge,
  CardBody,
  HeaderRow,
  TrayId,
  Percentage,
  ProgressBar,
  GrowthGrid,
  GridRow,
  Cell,
  FooterRow,
  GridSize,
  CropCount
} from './styles';
import { GenerationBlockProps } from './types';
import { generateGrowthMatrix } from './utils';

export const GenerationBlock: React.FC<GenerationBlockProps> = ({
  slotNumber = 4,
  trayId = 'TR-15199256',
  progressPercentage = 75,
  gridRows = 20,
  gridColumns = 10,
  totalCrops = 170,
  className,
  onCropClick,
  growthStatusMatrix
}) => {
  const growthMatrix = useMemo(() => {
    if (growthStatusMatrix) {
      return { rows: growthStatusMatrix };
    }
    return generateGrowthMatrix(gridRows, gridColumns, totalCrops);
  }, [growthStatusMatrix, gridRows, gridColumns, totalCrops]);
  
  return (
    <Container className={className}>
      <TopStack>
        <SlotBadge>SLOT {slotNumber}</SlotBadge>
      </TopStack>
      
      <CardBody>
        <HeaderRow>
          <TrayId>{trayId}</TrayId>
          <Percentage>{progressPercentage}%</Percentage>
        </HeaderRow>
        
        <ProgressBar $progress={progressPercentage} />
        
        <GrowthGrid>
          {growthMatrix.rows.map((row, rowIndex) => (
            <GridRow key={`row-${rowIndex}`}>
              {row.map((cell: any, cellIndex: number) => {
                // Handle both object format { status: 'sprout' } and string format 'healthy'
                const cellStatus = typeof cell === 'object' && cell.status ? cell.status : cell;
                const normalizedStatus = 
                  cellStatus === 'sprout' || cellStatus === 'healthy' ? 'healthy' : 
                  cellStatus === 'not-ok' || cellStatus === 'alert' ? 'alert' : 
                  'empty';
                
                return (
                  <Cell 
                    key={`cell-${rowIndex}-${cellIndex}`} 
                    $status={normalizedStatus}
                    onClick={() => {
                      if (normalizedStatus !== 'empty' && onCropClick) {
                        onCropClick(rowIndex, cellIndex);
                      }
                    }}
                    style={{ cursor: normalizedStatus !== 'empty' && onCropClick ? 'pointer' : 'default' }}
                  />
                );
              })}
            </GridRow>
          ))}
        </GrowthGrid>
        
        <FooterRow>
          <GridSize>{gridColumns}x{gridRows} Grid</GridSize>
          <CropCount>{totalCrops} crops</CropCount>
        </FooterRow>
      </CardBody>
    </Container>
  );
};