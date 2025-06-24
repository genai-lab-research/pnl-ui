import React from 'react';
import { 
  NotificationContainer, 
  Avatar, 
  ContentContainer, 
  NotificationMessage, 
  MetaContainer, 
  TimestampContainer, 
  ClockIcon, 
  Timestamp, 
  AuthorName 
} from './NotificationRow.styles';
import { NotificationRowProps } from './types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

export const NotificationRow: React.FC<NotificationRowProps> = ({
  message,
  timestamp,
  authorName,
  avatarUrl
}) => {
  return (
    <NotificationContainer>
      <Avatar>
        {avatarUrl ? (
          <img src={avatarUrl} alt={authorName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        ) : (
          <PersonIcon fontSize="small" />
        )}
      </Avatar>

      <ContentContainer>
        <NotificationMessage>{message}</NotificationMessage>
        <MetaContainer>
          <TimestampContainer>
            <ClockIcon>
              <AccessTimeIcon fontSize="inherit" />
            </ClockIcon>
            <Timestamp>{timestamp}</Timestamp>
          </TimestampContainer>
          <AuthorName>{authorName}</AuthorName>
        </MetaContainer>
      </ContentContainer>
    </NotificationContainer>
  );
};

export default NotificationRow;