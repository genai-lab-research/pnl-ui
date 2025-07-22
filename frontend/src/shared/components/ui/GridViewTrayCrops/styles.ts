import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 162px;
  height: 400px;
  position: relative;
  gap: 10px;
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

export const SlotBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background-color: #E7EBF2;
  border-radius: 0px;
  font-family: 'Inter', sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: 10px;
  color: #09090B;
  text-transform: uppercase;
  width: 100%;
  margin-bottom: 2px;
`;

export const TrayInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #09090B;
`;

export const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 2px;
  margin-top: 2px;
  border-radius: 10px;
  background-color: #E6EAF1;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background-color: #464646;
    border-radius: 10px;
  }
`;

export const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 151px;
  height: auto;
  max-height: 350px;
  border: 1px solid #E6EAF1;
  border-radius: 6px;
  background-color: #FFFFFF;
  padding: 12px 8px 8px 8px;
  overflow: hidden;
`;

export const DotGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, 1fr);
  gap: 3px;
  justify-items: center;
  align-items: center;
  width: 100%;
  max-height: 280px;
  overflow-y: auto;
  padding: 2px;
`;

export const Dot = styled.div<{ $isHealthy: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$isHealthy ? '#4CAF50' : '#E0E0E0'};
  flex-shrink: 0;
`;

export const FooterText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 8px;
  width: 100%;
`;

export const GridStats = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #666666;
  text-align: center;
`;