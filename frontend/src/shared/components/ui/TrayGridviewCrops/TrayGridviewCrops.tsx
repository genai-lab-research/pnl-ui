import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export interface TrayGridviewCropsProps {
  /** Title text to display (e.g., "SLOT 1") */
  title?: string;
  /** Item code to display (e.g., "TR-15199256") */
  itemCode?: string;
  /** Progress value in percentage (0-100) */
  value: number;
  /** Number of rows in the grid */
  rows?: number;
  /** Number of columns in the grid */
  columns?: number;
  /** Text to display for grid dimensions (e.g., "10x20 Grid") */
  gridSizeText?: string;
  /** Number of items (e.g., "170 crops") */
  itemCount?: number;
  /** Optional item label (e.g., "crops") */
  itemLabel?: string;
  /** If true, will disable the component with reduced opacity */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
  sx?: object;
  /** Callback fired when a crop (grid dot) is clicked */
  onCropClick?: (cropId: string) => void;
  /** Array of crop IDs that correspond to active grid dots */
  cropIds?: string[];
}

const Container = styled(Box)<{ disabled?: boolean }>(({ disabled }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '162px',
  minWidth: '162px',
  border: '1px solid #E6E8FC',
  borderRadius: '8px',
  padding: '0px', // Remove padding to accommodate header image
  backgroundColor: 'white',
  opacity: disabled ? 0.5 : 1,
  boxShadow: '0px 2px 0px 0px #E6E8FC',
  overflow: 'hidden', // Ensure content stays within rounded borders
}));

const HeaderImageContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '32px',
  backgroundImage: 'url(/TraySlot_wrapper_header.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const HeaderOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
}));

const ContentContainer = styled(Box)(() => ({
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}));

const TitleText = styled(Typography)(() => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '8px',
  fontWeight: 500,
  lineHeight: '10px',
  color: '#6E7191',
  textTransform: 'uppercase',
  letterSpacing: '0px',
  textAlign: 'center',
  textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)', // Add text shadow for better visibility on image
}));

const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '8px',
}));

const ItemCodeText = styled(Typography)(() => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '12px',
  fontWeight: 'bold',
  lineHeight: '20px',
  color: '#090B0B',
}));

const ProgressContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '12px',
}));

const ProgressBar = styled(Box)(() => ({
  height: '4px',
  backgroundColor: '#E6E8FC',
  borderRadius: '2px',
  position: 'relative',
  overflow: 'hidden',
}));

const ProgressFill = styled(Box)<{ progress: number }>(({ progress }) => ({
  height: '100%',
  width: `${progress}%`,
  background: 'linear-gradient(90deg, #30CA45 0%, #30CA45 100%)',
  transition: 'width 0.3s ease',
}));

const PercentageText = styled(Typography)(() => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '20px',
  color: '#090B0B',
}));

const GridContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '1px',
  marginBottom: '8px',
  width: 'fit-content',
}));

const GridColumn = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  width: '8px', // Fixed width to maintain stable positioning
  alignItems: 'center', // Center dots within their column space
}));

// Using active prop for dot state with varied sizes, maintaining stable position
const GridDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'clickable' && prop !== 'size',
})<{ active: boolean; clickable?: boolean; size: 'small' | 'medium' | 'large' }>(({ active, clickable, size }) => {
  const sizeMap = {
    small: { width: '4px', height: '4px' },
    medium: { width: '6px', height: '6px' },
    large: { width: '8px', height: '8px' },
  };
  
  return {
    // Container maintains consistent 8px height for stable positioning
    height: '8px',
    width: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Actual dot with variable size
    '&::before': {
      content: '""',
      display: 'block',
      ...sizeMap[size],
      borderRadius: '50%',
      backgroundColor: active ? '#30CA45' : '#E6E8FC',
      transition: 'all 0.2s ease-in-out',
    },
    cursor: clickable && active ? 'pointer' : 'default',
    '&:hover::before': clickable && active ? {
      transform: 'scale(1.2)',
      backgroundColor: '#28B93F',
    } : {},
  };
});

const InfoContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 'auto',
}));

const InfoText = styled(Typography)(() => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '11px',
  fontWeight: 400,
  lineHeight: '20px',
  color: '#090B0B',
}));

/**
 * TrayGridviewCrops component visualizes progress as a grid of dots with a percentage indicator.
 * 
 * @component
 * @example
 * ```tsx
 * <TrayGridviewCrops 
 *   title="SLOT 1"
 *   itemCode="TR-15199256"
 *   value={75}
 *   rows={20}
 *   columns={10}
 *   gridSizeText="10x20 Grid"
 *   itemCount={170}
 *   itemLabel="crops"
 * />
 * ```
 */
export const TrayGridviewCrops: React.FC<TrayGridviewCropsProps> = ({
  title,
  itemCode,
  value,
  rows = 20,
  columns = 10,
  gridSizeText,
  itemCount,
  itemLabel = 'crops',
  disabled = false,
  className,
  sx,
  onCropClick,
  cropIds
}) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(0, value), 100);
  
  // Calculate the total number of dots
  const totalDots = rows * columns;
  
  // Calculate how many dots should be active based on the percentage
  const activeDots = Math.round((normalizedValue / 100) * totalDots);

  // Generate the grid of dots in vertical columns with varied sizes
  const renderGrid = () => {
    const grid = [];
    let dotCount = 0;
    
    // Create columns instead of rows
    for (let j = 0; j < columns; j++) {
      const columnDots = [];
      for (let i = 0; i < rows; i++) {
        const isActive = dotCount < activeDots;
        const cropId = cropIds && cropIds[dotCount] ? cropIds[dotCount] : `crop-${dotCount + 1}`;
        const clickable = onCropClick && isActive;
        
        // Vary dot sizes based on position to simulate growth stages
        let dotSize: 'small' | 'medium' | 'large' = 'small';
        if (isActive) {
          // Create varied sizes based on crop maturity
          const maturityLevel = Math.floor(dotCount / (totalDots * 0.33));
          if (maturityLevel >= 2) dotSize = 'large';
          else if (maturityLevel >= 1) dotSize = 'medium';
          else dotSize = 'small';
        }
        
        columnDots.push(
          <GridDot 
            key={`dot-${i}-${j}`} 
            active={isActive} 
            clickable={clickable}
            size={dotSize}
            onClick={clickable ? () => onCropClick(cropId) : undefined}
            aria-hidden="true"
            title={clickable ? `Click to view details for ${cropId}` : undefined}
          />
        );
        dotCount++;
      }
      grid.push(
        <GridColumn key={`column-${j}`}>
          {columnDots}
        </GridColumn>
      );
    }
    
    return grid;
  };

  return (
    <Container disabled={disabled} className={className} sx={sx}>
      {/* Header Image with Title Overlay */}
      <HeaderImageContainer>
        <HeaderOverlay>
          {title && <TitleText>{title}</TitleText>}
        </HeaderOverlay>
      </HeaderImageContainer>
      
      {/* Main Content */}
      <ContentContainer>
        {itemCode && (
          <HeaderContainer>
            <ItemCodeText>{itemCode} - {normalizedValue}%</ItemCodeText>
          </HeaderContainer>
        )}
        
        {!itemCode && (
          <PercentageText aria-label={`${normalizedValue}% complete`}>{normalizedValue}%</PercentageText>
        )}
        
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={normalizedValue} />
          </ProgressBar>
        </ProgressContainer>
        
        <GridContainer aria-label={`Grid visualization of ${normalizedValue}% complete`}>
          {renderGrid()}
        </GridContainer>
        
        <InfoContainer>
          {gridSizeText && <InfoText>{gridSizeText}</InfoText>}
          {itemCount !== undefined && (
            <InfoText>{`${itemCount} ${itemLabel}`}</InfoText>
          )}
        </InfoContainer>
      </ContentContainer>
    </Container>
  );
};

export default TrayGridviewCrops;