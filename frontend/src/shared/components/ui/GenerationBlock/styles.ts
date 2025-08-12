import styled from '@emotion/styled';

// Mobile-first breakpoints
const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px'
};

const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  xxl: `@media (min-width: ${breakpoints.xxl})`
};

export const GenerationBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 8px;
  box-shadow: 0 0 2px 0 rgba(65, 64, 69, 0.25);
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;

  ${mediaQueries.md} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    overflow-x: visible;
  }

`;

export const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #ffffff;
  border: 1px solid #C1C1C5;
  border-radius: 6px;
  width: 100%;
  min-height: 40px;
  position: relative;

  ${mediaQueries.md} {
    width: 376px;
    flex-shrink: 0;
  }
`;

export const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #71717A;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.94px;
  color: #000000;
  background: transparent;

  &::placeholder {
    color: #71717A;
  }
`;

export const FilterActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  overflow: visible;

  ${mediaQueries.md} {
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
    width: auto;
  }
`;

export const ChipGroupsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  overflow: visible;

  ${mediaQueries.md} {
    flex-wrap: nowrap;
    width: auto;
  }
`;

export const FilterChipContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 8px;
  background: transparent;
  border: 1px solid #CAC4D0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
  min-width: 130px;

  &:hover {
    background: rgba(73, 69, 79, 0.08);
  }

  &:active {
    background: rgba(73, 69, 79, 0.12);
  }
`;

export const ChipStateLayer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 4px;
  width: 100%;
  height: 100%;
`;

export const ChipLabel = styled.span`
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #49454F;
  flex: 1;
  text-align: left;
`;

export const ChipIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #49454F;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const AlertsToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 38px;
`;

export const AlertsLabel = styled.span`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16.94px;
  color: #000000;
  white-space: nowrap;
`;

export const SwitchContainer = styled.div`
  position: relative;
  width: 58px;
  height: 38px;
  cursor: pointer;
`;

export const SwitchTrack = styled.div<{ checked: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 34px;
  height: 14px;
  background: ${props => props.checked ? '#4CAF50' : '#000000'};
  opacity: ${props => props.checked ? 1 : 0.38};
  border-radius: 10px;
  transition: all 0.2s ease;
`;

export const SwitchKnob = styled.div<{ checked: boolean }>`
  position: absolute;
  top: 50%;
  left: ${props => props.checked ? 'calc(100% - 19px)' : '0'};
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    background: #FAFAFA;
    border-radius: 50%;
    box-shadow: 
      0 1px 3px 0 #4C4E64,
      0 1px 1px 0 #4C4E64,
      0 2px 1px -1px #4C4E64;
  }
`;

export const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  background: rgba(109, 120, 141, 0.11);
  border: none;
  border-radius: 6px;
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #000000;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
  min-width: 125px;
  white-space: nowrap;

  &:hover {
    background: rgba(109, 120, 141, 0.16);
  }

  &:active {
    background: rgba(109, 120, 141, 0.22);
  }

  &:focus {
    outline: 2px solid #4CAF50;
    outline-offset: 2px;
  }
`;

export const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 9999;
  background: #ffffff;
  border: 1px solid #CAC4D0;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

export const DropdownOption = styled.div<{ isSelected?: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #49454F;
  background: ${props => props.isSelected ? 'rgba(73, 69, 79, 0.08)' : 'transparent'};
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(73, 69, 79, 0.08);
  }

  &:active {
    background: rgba(73, 69, 79, 0.12);
  }

  &:first-of-type {
    border-radius: 6px 6px 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 6px 6px;
  }
`;

export const LoadingSpinner = styled.div`
  position: absolute;
  right: 10px;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  border-radius: 50%;
  border-top-color: #4CAF50;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ChipLoadingSpinner = styled(LoadingSpinner)`
  position: static;
  margin-left: 4px;
`;