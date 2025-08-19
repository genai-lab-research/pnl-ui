import React from 'react';
import { DataTableRowProps, CellData } from './types';
import {
  RowContainer,
  Cell,
  CellText,
  StatusChip,
  LoadingCell,
  LoadingSkeleton,
  ErrorContainer,
} from './styles';

/**
 * DataTableRow - A reusable, responsive data table row component
 * 
 * This component renders a flexible table row with configurable cells that can display:
 * - Text content with various font weights
 * - Status chips with different variants
 * - Custom React content
 * - Loading and error states
 * 
 * @param cells - Array of cell data to render
 * @param loading - Whether the row is in a loading state
 * @param error - Error message to display instead of content
 * @param selected - Whether the row is selected
 * @param disabled - Whether the row is disabled
 * @param onClick - Click handler for the entire row
 * @param onHover - Hover handler for the row
 * @param size - Size variant for the row ('sm' | 'md' | 'lg')
 * @param variant - Visual variant ('default' | 'bordered' | 'elevated')
 * @param className - Custom className for additional styling
 * @param ariaLabel - Accessibility label for the row
 * @param clickable - Whether the row is clickable
 */
export const DataTableRow: React.FC<DataTableRowProps> = ({
  cells,
  loading = false,
  error,
  selected = false,
  disabled = false,
  onClick,
  onHover,
  size = 'md',
  variant = 'default',
  className,
  ariaLabel,
  clickable = !!onClick,
}) => {
  const handleMouseEnter = () => {
    if (onHover && !disabled) {
      onHover(true);
    }
  };

  const handleMouseLeave = () => {
    if (onHover && !disabled) {
      onHover(false);
    }
  };

  const handleClick = () => {
    if (onClick && !disabled && !loading) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick && !disabled && !loading) {
      event.preventDefault();
      onClick();
    }
  };

  // Render loading state
  if (loading) {
    return (
      <RowContainer
        className={className}
        variant={variant}
        disabled={disabled}
        role="row"
        aria-label={ariaLabel}
      >
        {cells.map((cell, index) => (
          <LoadingCell key={cell.id || index}>
            <LoadingSkeleton width={cell.width ? `${cell.width - 24}px` : undefined} />
          </LoadingCell>
        ))}
      </RowContainer>
    );
  }

  // Render error state
  if (error) {
    return (
      <RowContainer
        className={className}
        variant={variant}
        disabled={disabled}
        role="row"
        aria-label={ariaLabel}
      >
        <ErrorContainer>
          Error: {error}
        </ErrorContainer>
      </RowContainer>
    );
  }

  // Render normal state
  return (
    <RowContainer
      className={className}
      clickable={clickable}
      selected={selected}
      disabled={disabled}
      variant={variant}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="row"
      tabIndex={clickable ? 0 : undefined}
      aria-label={ariaLabel}
      aria-selected={selected}
      aria-disabled={disabled}
    >
      {cells.map((cell, index) => (
        <Cell
          key={cell.id || index}
          alignment={cell.alignment}
          width={cell.width}
          flex={cell.flex}
          size={size}
          role="gridcell"
          aria-label={cell.ariaLabel}
        >
          {renderCellContent(cell)}
        </Cell>
      ))}
    </RowContainer>
  );
};

/**
 * Renders the content for a single cell based on its type
 */
const renderCellContent = (cell: CellData): React.ReactNode => {
  switch (cell.type) {
    case 'text':
      return (
        <CellText fontWeight={cell.fontWeight}>
          {cell.content}
        </CellText>
      );
    
    case 'status':
      return (
        <StatusChip variant={cell.statusVariant || 'inactive'}>
          {cell.content}
        </StatusChip>
      );
    
    case 'custom':
      return cell.customContent;
    
    default:
      return (
        <CellText fontWeight={cell.fontWeight}>
          {cell.content}
        </CellText>
      );
  }
};
