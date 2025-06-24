import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  position: relative;
  border: 1px solid #E4E4E7;
  border-radius: 5px;
`;

export const AreaLabelPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 80px;
  height: 40px;
  padding: 0 4px;
  gap: 2px;
  border: 1px solid #E1E1E1;
  justify-content: center;
  box-sizing: border-box;
`;

export const AreaText = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  color: #000000;
  text-align: left;
`;

export const AreaUnitText = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: 10px;
  color: #939393;
  text-align: left;
`;

export const ValuePanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 36px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 1px solid #E1E1E1;
  box-sizing: border-box;
`;

export const ValueText = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: 8px;
  color: #000000;
  text-align: center;
`;

export const GraphPanel = styled.div`
  display: flex;
  flex: 1;
  height: 40px;
  padding: 8px 4px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const AlertBubbleContainer = styled.div`
  position: absolute;
  top: -11px;
  right: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BlueDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #4781F7;
  border: 1px solid #FFFFFF;
  border-radius: 50%;
`;

export const BubbleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 14px;
  padding: 0 4px;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  box-shadow: 0px 2px 3px 0px rgba(0,0,0,1);
`;

export const BubbleText = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: 14px;
  color: #000000;
  text-align: center;
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;