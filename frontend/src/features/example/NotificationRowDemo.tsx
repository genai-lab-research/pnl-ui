import React from 'react';
import styled from '@emotion/styled';
import NotificationRow from '../../shared/components/ui/NotificationRow';
import { ComponentSet } from '../../shared/components/ui/NotificationRow/NotificationRow.styles';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const Title = styled.h2`
  font-family: Inter, sans-serif;
  font-size: 18px;
  margin-bottom: 10px;
`;

const NotificationRowDemo: React.FC = () => {
  const notifications = [
    {
      message: 'Environment mode switched to Auto',
      timestamp: 'April 10, 2025 – 10:00PM',
      authorName: 'Markus Johnson',
    },
    {
      message: 'Temperature adjusted to 22°C',
      timestamp: 'April 11, 2025 – 09:15AM',
      authorName: 'Sarah Thompson',
    },
    {
      message: 'Light intensity increased to 75%',
      timestamp: 'April 12, 2025 – 02:30PM',
      authorName: 'Alex Rodriguez',
    },
  ];

  return (
    <DemoContainer>
      <Title>Notification Row Demo</Title>
      <ComponentSet>
        {notifications.map((notification, index) => (
          <NotificationRow
            key={index}
            message={notification.message}
            timestamp={notification.timestamp}
            authorName={notification.authorName}
          />
        ))}
      </ComponentSet>
    </DemoContainer>
  );
};

export default NotificationRowDemo;