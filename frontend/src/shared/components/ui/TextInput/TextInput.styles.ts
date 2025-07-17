import styled from '@emotion/styled';
import { colors } from '../../../styles';

/**
 * Main container for the TextInput component
 */
export const InputContainer = styled.div`
  display: flex;
  flex-direction: vertical;
  position: relative;
  width: 372px;
  height: 80px;
`;

/**
 * Container for the default state of the input
 */
export const DefaultContainer = styled.div`
  display: flex;
  flex-direction: vertical;
  position: relative;
  width: 372px;
  height: 80px;
  border: 1px solid ${colors.opacity.secondary22};
  border-radius: 6px;
  padding-left: 12px;
  padding-right: 12px;
`;

/**
 * Container for the inactive state
 */
export const InactiveContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 348px;
  height: 40px;
  padding-left: 5px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-left: 12px;
  margin-right: 12px;
  gap: 8px;
`;

/**
 * Styled input element with placeholder styling
 */
export const StyledInput = styled.input`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: ${colors.opacity.secondary60};
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;

  &::placeholder {
    color: ${colors.opacity.secondary60};
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
