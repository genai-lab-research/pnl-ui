/** @jsxImportSource @emotion/react */
import React from 'react';
import clsx from 'clsx';
import {
  rowStyles,
  cellStyles,
  containerStyles,
  textStyles,
  iconContainerStyles,
  loadingStyles,
  errorStyles,
} from './styles';
import { StatusPill, IconButton } from './components';
import { useDataGridRow } from './hooks';
import type { DataGridRowProps } from './types';

export const DataGridRow: React.FC<DataGridRowProps> = ({
  cells = [],
  icon,
  status,
  alert,
  menu,
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  clickable = false,
  onClick,
  selected = false,
  disabled = false,
  ariaLabel,
  className,
  testId,
}) => {
  const { handleClick, handleKeyDown, isClickable } = useDataGridRow({
    onClick: clickable ? onClick : undefined,
    disabled,
    loading,
    error,
  });

  // Error state
  if (error) {
    return (
      <tr
        css={errorStyles}
        className={className}
        role="alert"
        aria-label={ariaLabel || `Error: ${error}`}
        data-testid={testId}
      >
        <td colSpan={cells.length + (icon ? 1 : 0) + (status ? 1 : 0) + (alert ? 1 : 0) + (menu ? 1 : 0)}>
          {error}
        </td>
      </tr>
    );
  }

  // Loading state
  if (loading) {
    return (
      <tr
        css={[rowStyles, loadingStyles]}
        className={clsx(
          `variant-${variant}`,
          `size-${size}`,
          className
        )}
        aria-label={ariaLabel || 'Loading data row'}
        data-testid={testId}
      >
        {/* Icon cell */}
        <td css={cellStyles} className="cell-icon">
          <div className="skeleton skeleton-icon" />
        </td>

        {/* Data cells */}
        {cells.map((_, index) => (
          <td key={index} css={cellStyles} className={`cell-data-${index}`}>
            <div css={containerStyles} className="container-basic">
              <div className={`skeleton skeleton-text ${index === 0 ? 'skeleton-name' : 'skeleton-tenant'}`} />
            </div>
          </td>
        ))}

        {/* Status cell */}
        <td css={cellStyles} className="cell-status">
          <div className="skeleton skeleton-status" />
        </td>

        {/* Alert cell */}
        <td css={cellStyles} className="cell-alert">
          <div className="skeleton skeleton-icon" />
        </td>

        {/* Menu cell */}
        <td css={cellStyles} className="cell-menu">
          <div className="skeleton skeleton-icon" />
        </td>
      </tr>
    );
  }

  // Main render
  const rowClassName = clsx(
    `variant-${variant}`,
    `size-${size}`,
    {
      clickable: isClickable,
      selected,
      disabled,
    },
    className
  );

  const renderIcon = () => {
    if (icon?.slot) {
      return icon.slot;
    }

    if (icon?.path) {
      return (
        <img
          src={icon.path}
          alt=""
          role="presentation"
          style={{
            width: `${icon.size || 16}px`,
            height: `${icon.size || 16}px`,
            display: 'block',
          }}
        />
      );
    }

    // Default cloud icon as per Figma design
    if (icon?.name === 'cloud') {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.3333 5.33333C11.3333 3.86666 10.1333 2.66666 8.66666 2.66666C7.46666 2.66666 6.43999 3.43999 6.11999 4.50666C5.99999 4.50666 5.87332 4.51999 5.75332 4.54666C4.77332 4.73999 3.99999 5.51999 3.99999 6.52C3.99999 7.58666 4.91332 8.5 5.97999 8.5H11.2667C12.2267 8.5 13 7.72666 13 6.76666C13 5.80666 12.2267 5.03333 11.2667 5.03333C11.29 5.13333 11.3333 5.23333 11.3333 5.33333Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      );
    }

    return null;
  };

  const renderCell = (cell: typeof cells[0], index: number) => {
    if (React.isValidElement(cell.content)) {
      return cell.content;
    }

    return (
      <div
        css={containerStyles}
        className={index === 0 ? 'container-name' : 'container-basic'}
      >
        <span
          css={textStyles}
          className={clsx({
            'text-name': index === 0 && typeof cell.content === 'string',
            'text-date': typeof cell.content === 'string' && /\d{2}\/\d{2}\/\d{4}/.test(cell.content),
          })}
          style={{ fontWeight: cell.fontWeight }}
        >
          {cell.content}
        </span>
      </div>
    );
  };

  return (
    <tr
      css={rowStyles}
      className={rowClassName}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      aria-label={ariaLabel}
      aria-selected={selected}
      data-testid={testId}
    >
      {/* Leading Icon Cell */}
      {icon && (
        <td css={cellStyles} className="cell-icon">
          <div css={iconContainerStyles}>
            {renderIcon()}
          </div>
        </td>
      )}

      {/* Data Cells */}
      {cells.map((cell, index) => {
        const cellType = index === 0 ? 'name' : 
                         index === 1 ? 'tenant' :
                         index === 2 ? 'environment' :
                         index === 3 ? 'location' :
                         'date';

        return (
          <td
            key={index}
            css={cellStyles}
            className={`cell-${cellType}`}
            style={{ width: cell.width }}
          >
            {cell.onClick ? (
              <button
                css={[containerStyles]}
                className={index === 0 ? 'container-name' : 'container-basic'}
                onClick={cell.onClick}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: cell.align || 'left',
                }}
              >
                {renderCell(cell, index)}
              </button>
            ) : (
              <div
                css={containerStyles}
                className={index === 0 ? 'container-name' : 'container-basic'}
                style={{ textAlign: cell.align || 'left' }}
              >
                {renderCell(cell, index)}
              </div>
            )}
          </td>
        );
      })}

      {/* Status Cell */}
      {status && (
        <td css={cellStyles} className="cell-status">
          <StatusPill
            label={status.label}
            variant={status.variant}
            size={size}
          />
        </td>
      )}

      {/* Alert Cell */}
      {alert && (
        <td css={cellStyles} className="cell-alert">
          <IconButton
            icon={alert.icon}
            iconPath={alert.path}
            ariaLabel={alert.message || 'Alert'}
            size={16}
          />
        </td>
      )}

      {/* Menu Cell */}
      {menu && (
        <td css={cellStyles} className="cell-menu">
          <IconButton
            icon={menu.icon}
            iconPath={menu.path}
            onClick={menu.onClick}
            ariaLabel="More options"
            size={16}
          />
        </td>
      )}
    </tr>
  );
};