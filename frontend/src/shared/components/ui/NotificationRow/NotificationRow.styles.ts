import styled from '@emotion/styled';
import { colors } from '../../../styles';

export const NotificationRowContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  width: 100%;
  border: 1px solid ${colors.opacity.borderGray10};
  border-radius: 8px;
  gap: 12px;
`;

export const IconContainer = styled.div<{ type: 'error' | 'warning' | 'success' }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.type === 'success' ? colors.status.successDark :
    props.type === 'warning' ? colors.status.warning :
    colors.status.error
  };
  flex-shrink: 0;
`;

export const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`;

export const NotificationTitle = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${colors.text.primary};
`;

export const NotificationDescription = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${colors.opacity.borderGray50};
`;

export const NotificationTime = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${colors.text.disabled};
  flex-shrink: 0;
`;

export const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

export const ActionButton = styled.button`
  padding: 4px 8px;
  border: 1px solid ${colors.primary.light};
  border-radius: 4px;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${colors.opacity.primary04};
  }
`;