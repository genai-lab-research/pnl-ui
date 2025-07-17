import styled from '@emotion/styled';
import { colors } from '../../../styles';

export const RowContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: vertical;
  width: 1344px;
  height: 52px;
  align-items: flex-start;
  justify-content: flex-start;
  border: 1px solid ${colors.primary.light};
  border-radius: 5px;
`;

export const GenerationBlock = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  width: 100%;
  height: 52px;
  align-items: center;
  justify-content: flex-start;
  padding: 1px 0;
  background-color: ${colors.background.primary};
  border: 1px solid ${colors.opacity.secondary12};
`;

export const DataGridCell = styled.div<{ grow?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 50px;
  flex-grow: ${props => props.grow ? 1 : 0};
`;

export const CropNameContainer = styled.div`
  display: flex;
  padding: 16px 12px;
  align-items: center;
`;

export const GenerationContainer = styled.div`
  display: flex;
  padding: 12px 15px;
  align-items: center;
`;

export const StandardContainer = styled.div`
  display: flex;
  padding: 6px 12px;
  align-items: center;
`;

export const Chip = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 3px 7px;
  background-color: ${colors.status.successDark};
  border-radius: 9999px;
`;

export const CropNameText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  color: ${colors.text.primary};
  text-align: left;
`;

export const StandardText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  color: ${colors.text.primary};
  text-align: left;
`;

export const ChipText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
  color: ${colors.component.switchThumb};
  text-align: left;
`;