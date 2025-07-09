import styled from '@emotion/styled';

export const TimelapsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: vertical;
  width: 1353px;
  height: 38px;
`;

export const GenerationBlockContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 38px;
  align-items: flex-end;
`;

export const TimelineCellsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 1344px;
  height: 18px;
  justify-content: space-between;
  align-items: center;
`;

export const TimelineCell = styled.div<{ isActive: boolean; isFuture?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 2px;
  background-color: ${(props) => props.isActive ? '#ABC3F2' : '#E6EBF6'};
  opacity: ${(props) => props.isFuture ? 0.4 : 1};
`;

export const DateLabel = styled.div`
  font-family: Inter, sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: 8px;
  color: rgba(9, 9, 11, 0.5);
  text-align: center;
`;

export const StartDateLabel = styled(DateLabel)`
  position: absolute;
  left: 0;
  bottom: 0;
`;

export const EndDateLabel = styled(DateLabel)`
  position: absolute;
  right: 0;
  bottom: 0;
`;

export const TooltipContainer = styled.div<{ position: number }>`
  position: absolute;
  left: ${(props) => `${props.position}px`};
  top: -28px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 42px;
  height: 28px;
`;

export const TooltipArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(255, 255, 255, 0.9);
  margin-top: 0;
`;

export const TooltipContent = styled.div`
  display: flex;
  padding: 6px;
  background-color: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0px 2px 8px 0px #151F27, 0px 0px 3px 0px #151F28;
  margin-bottom: 5px;
`;

export const TooltipText = styled.div`
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: 10px;
  color: #09090B;
  text-align: left;
`;