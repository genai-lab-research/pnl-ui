import React, { useMemo } from 'react';
import { Skeleton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GridStatusCardProps } from './types';
import {
  generateDefaultGrid,
  countItemsByStatus,
  formatGridDimensions,
  getStatusColor
} from './utils';
import {
  Container,
  StyledCard,
  StyledLabel,
  LabelText,
  ProgressTrack,
  ProgressFill,
  HeaderBar,
  IdentifierText,
  PercentageText,
  UtilizationBar,
  UtilizationFill,
  GridContainer,
  GridRow,
  GridDot,
  FooterBar,
  FooterLabel,
  FooterValue,
  ActionButton
} from './GridStatusCard.styles';

export const GridStatusCard: React.FC<GridStatusCardProps> = ({
  slotLabel = 'SLOT',
  slotNumber = '5',
  title = 'TR-15199256',
  utilization = 75,
  progressValue = 0,
  progressColor,
  showProgress = true,
  gridRows = 10,
  gridColumns = 20,
  gridData,
  gridLabel = '10 × 20 Grid',
  itemCount,
  itemLabel = 'crops',
  actionLabel = 'Add Tray',
  actionIcon,
  onActionClick,
  loading = false,
  error,
  className,
  ariaLabel,
  statusColors,
  onGridItemClick,
}) => {
  // Memoize grid data generation
  const actualGridData = useMemo(
    () => gridData || generateDefaultGrid(gridRows, gridColumns, 0.85),
    [gridData, gridRows, gridColumns]
  );

  // Memoize item count calculation
  const actualItemCount = useMemo(
    () => itemCount !== undefined ? itemCount : countItemsByStatus(actualGridData, 'active'),
    [itemCount, actualGridData]
  );

  // Memoize grid label
  const gridLabelText = useMemo(
    () => gridLabel || formatGridDimensions(gridRows, gridColumns),
    [gridLabel, gridRows, gridColumns]
  );

  if (loading) {
    return (
      <Container className={className}>
        <Skeleton variant="rectangular" width={162} height={301} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={className}>
        <Typography color="error" variant="body2">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container className={className} aria-label={ariaLabel}>
      {slotLabel && (
        <>
          <StyledLabel>
            <LabelText>{`${slotLabel} ${slotNumber}`}</LabelText>
          </StyledLabel>
          {showProgress && (
            <ProgressTrack>
              <ProgressFill value={progressValue} progressColor={progressColor} />
            </ProgressTrack>
          )}
        </>
      )}
      
      <StyledCard>
        <HeaderBar>
          <IdentifierText>{title}</IdentifierText>
          <PercentageText>{`${utilization} %`}</PercentageText>
        </HeaderBar>

        <UtilizationBar>
          <UtilizationFill value={utilization} />
        </UtilizationBar>

        <GridContainer>
          {actualGridData.slice(0, gridRows).map((row, rowIndex) => (
            <GridRow key={rowIndex}>
              {row.slice(0, gridColumns).map((item, colIndex) => (
                <GridDot
                  key={`${rowIndex}-${colIndex}`}
                  statusColor={item.color || getStatusColor(item.status, statusColors)}
                  onClick={() => onGridItemClick?.(rowIndex, colIndex, item)}
                  style={{ cursor: onGridItemClick ? 'pointer' : 'default' }}
                />
              ))}
            </GridRow>
          ))}
        </GridContainer>

        <FooterBar>
          <FooterLabel>{gridLabelText}</FooterLabel>
          <FooterValue>{`${actualItemCount} ${itemLabel}`}</FooterValue>
        </FooterBar>
      </StyledCard>
      
      {onActionClick && (
        <ActionButton
          variant="text"
          startIcon={actionIcon || <AddCircleOutlineIcon />}
          onClick={onActionClick}
        >
          {actionLabel}
        </ActionButton>
      )}
    </Container>
  );
};