import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 28px;
  gap: 16px;
  border-radius: 5px;
`;

export const Label = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0px;
  color: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  text-align: left;
`;

export const PercentageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PercentageText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-size: 16px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0px;
  color: #000000;
  text-transform: uppercase;
  text-align: left;
`;

export const ProgressBarContainer = styled.div`
  position: relative;
  width: 200px;
  height: 12px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ percentage: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ percentage }) => `${percentage}%`};
  background: linear-gradient(to right, #30CA45, #30CA45);
  border-radius: 10px;
`;