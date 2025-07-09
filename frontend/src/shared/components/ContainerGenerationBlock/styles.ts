import styled from '@emotion/styled';
import { StatusType } from './types';

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 408px;
  height: 22px;
  gap: 12px;
  background-color: transparent;
  padding: 0;
`;

export const IconContainer = styled.div`
  width: 16px;
  height: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LabelText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.94px;
  color: #71717A;
  flex-grow: 1;
  text-align: left;
`;

export const StatusChip = styled.div<{ statusType: StatusType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 11px;
  border-radius: 9999px;
  height: 22px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #FAFAFA;
  background-color: ${({ statusType }) => {
    switch (statusType) {
      case 'active':
        return '#479F67'; // Success green
      case 'inactive':
        return '#71717A'; // Gray
      case 'error':
        return '#E11D48'; // Error red
      case 'warning':
        return '#F59E0B'; // Warning yellow
      default:
        return '#479F67';
    }
  }};
`;