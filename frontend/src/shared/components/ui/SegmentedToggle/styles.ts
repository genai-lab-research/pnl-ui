import styled, { css } from 'styled-components';
import { SegmentedToggleStyleProps } from './types';

export const StyledSegmentedToggle = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  background-color: transparent;
  border-radius: 5px;
  overflow: hidden;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'fit-content'};
  position: relative;
`;

export const StyledSegmentedOption = styled.button<SegmentedToggleStyleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-family: 'Roboto, sans-serif';
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  border: 1px solid rgba(109, 120, 141, 0.5);
  border-right: none;
  min-width: ${({ $fullWidth }) => $fullWidth ? 'auto' : '103px'};
  height: 30px;
  position: relative;
  flex: ${({ $fullWidth }) => $fullWidth ? '1' : 'none'};

  &:last-child {
    border-right: 1px solid rgba(109, 120, 141, 0.5);
  }

  &:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  &:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ $isSelected }) =>
    $isSelected
      ? css`
          background-color: #455168;
          color: #FFFFFF;
          border-color: #455168;
        `
      : css`
          background-color: transparent;
          color: #455168;
          border-color: rgba(109, 120, 141, 0.5);

          &:hover:not(:disabled) {
            background-color: rgba(69, 81, 104, 0.08);
            color: #455168;
          }
        `}

  ${({ $size, $fullWidth }) =>
    $size === 'sm' &&
    css`
      padding: 6px 8px;
      font-size: 12px;
      height: 24px;
      min-width: ${$fullWidth ? 'auto' : '80px'};
    `}

  ${({ $size, $fullWidth }) =>
    $size === 'lg' &&
    css`
      padding: 14px 16px;
      font-size: 16px;
      height: 40px;
      min-width: ${$fullWidth ? 'auto' : '120px'};
    `}

  ${({ $variant }) =>
    $variant === 'outlined' &&
    css`
      border: 1px solid #E9EDF4;
      border-radius: 4px;
      margin: 2px;
    `}

  ${({ $variant }) =>
    $variant === 'elevated' &&
    css`
      box-shadow: 0 1px 3px 0 rgba(76, 78, 100, 0.1);
      margin: 2px;
      border-radius: 4px;
    `}

  &:focus-visible {
    outline: 2px solid #4CAF50;
    outline-offset: 2px;
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  min-width: 103px;
  height: 30px;
`;

export const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
`;