import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  border-radius: 5px;
`;

export const BarRow = styled.div`
  display: flex;
  width: 100%;
  height: 18px;
  gap: 1px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const BarSegment = styled.div<{ isSelected?: boolean }>`
  height: 18px;
  flex-grow: 1;
  border-radius: 2px;
  background-color: ${({ isSelected }) => isSelected ? '#ABC3F2' : '#E6EBF6'};
`;

export const DateLabel = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  font-family: 'Inter', sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: 8px;
  color: rgba(9, 9, 11, 0.5);
  ${({ position }) => position === 'left' ? 'left: 0;' : 'right: 0;'}
  margin-top: 4px;
`;

export const TooltipContainer = styled.div<{ position: number }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: -22px;
  left: ${({ position }) => `${position}%`};
  transform: translateX(-50%);
`;

export const TooltipArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #FFFFFF;
  opacity: 0.9;
  filter: drop-shadow(0px 1px 1px rgba(21, 31, 40, 0.3));
`;

export const TooltipBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 6px;
  background-color: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0px 2px 8px 0px rgba(21, 31, 39, 0.2), 0px 1px 3px 0px rgba(21, 31, 40, 0.2);
`;

export const TooltipText = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: 10px;
  color: #09090B;
  text-align: left;
`;
