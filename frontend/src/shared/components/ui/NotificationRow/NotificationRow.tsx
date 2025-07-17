import React from 'react';
import {
  NotificationRowContainer,
  IconContainer,
  NotificationContent,
  NotificationTitle,
  NotificationDescription,
  NotificationTime
} from './NotificationRow.styles';
import { NotificationRowProps } from './types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

export const NotificationRow: React.FC<NotificationRowProps> = ({
  message,
  timestamp,
  authorName
}) => {
  return (
    <NotificationRowContainer>
      <IconContainer type="success">
        <PersonIcon fontSize="small" />
      </IconContainer>

      <NotificationContent>
        <NotificationTitle>{message}</NotificationTitle>
        <NotificationDescription>
          <AccessTimeIcon fontSize="small" style={{ marginRight: '4px' }} />
          {timestamp} • {authorName}
        </NotificationDescription>
      </NotificationContent>

      <NotificationTime>
        {timestamp}
      </NotificationTime>
    </NotificationRowContainer>
  );
};

export default NotificationRow;