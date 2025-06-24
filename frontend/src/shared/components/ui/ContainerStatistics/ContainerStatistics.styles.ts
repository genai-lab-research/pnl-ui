import styled from '@emotion/styled';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #E4E4E7;
  border-radius: 6px;
  background-color: #FFFFFF;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
`;

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const StyledTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.15px;
  line-height: 24px;
`;

export const StyledCountBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F7F7F7;
  border-radius: 20px;
  width: 32px;
  height: 32px;
`;

export const StyledCount = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 23.625px;
  font-weight: 500;
  color: #0F1729;
`;

export const StyledChartsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
`;

export const StyledChartWrapper = styled.div`
  flex: 1;
  min-width: 280px;
`;

export const StyledChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const StyledChartTitle = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 20px;
`;

export const StyledValueContainer = styled.div`
  display: flex;
  gap: 12px;
`;

export const StyledValueGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StyledValueLabel = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 10px;
  font-weight: 400;
  text-transform: uppercase;
  opacity: 0.5;
  line-height: 20px;
`;

export const StyledValue = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 20px;
`;

export const StyledChartContainer = styled.div`
  position: relative;
  height: 90px;
  margin-bottom: 5px;
`;

export const StyledDayLabels = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
`;

export const StyledDayLabel = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #4C4E64;
  opacity: 0.6;
  letter-spacing: 0.4px;
  line-height: 14px;
  width: 24px;
  text-align: center;
`;
