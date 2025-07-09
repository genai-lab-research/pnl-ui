import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 162px;
  height: 301px;
  position: relative;
  gap: 10px;
`;

export const TopStack = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

export const SlotBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 8px;
  background-color: #E7EBF2;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: 10px;
  color: #09090B;
  text-transform: uppercase;
  height: 18px;
  width: 151px;
  box-sizing: border-box;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 151px;
  height: 273px;
  border: 1px solid #E6EAF1;
  border-radius: 6px;
  background-color: #F7F9FD;
  box-shadow: 0px 2px 0px 0px #E7EBF2;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2px 8px;
`;

export const TrayId = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  color: #09090B;
`;

export const Percentage = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #09090B;
`;

export const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.$progress || 0}%;
    background: linear-gradient(to right, #30CA45, #30CA45);
  }
`;

export const GrowthGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px 8px;
  gap: 2px;
  width: 100%;
`;

export const GridRow = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
  justify-content: flex-start;
`;

export const Cell = styled.div<{ $status: 'healthy' | 'alert' | 'empty' }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: ${({ $status }) => {
    switch ($status) {
      case 'healthy':
        return '#2FCA44';
      case 'alert':
        return '#FFA328';
      case 'empty':
      default:
        return '#E7EBF2';
    }
  }};
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2px 8px;
`;

export const GridSize = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(9, 9, 11, 0.5);
`;

export const CropCount = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 20px;
  color: #09090B;
`;