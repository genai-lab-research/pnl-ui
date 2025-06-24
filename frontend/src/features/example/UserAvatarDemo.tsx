import React from 'react';
import { UserAvatar } from '../../shared/components/ui/UserAvatar';
import styled from '@emotion/styled';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const DemoLabel = styled.span`
  font-size: 14px;
  color: #666;
  min-width: 100px;
`;

const UserAvatarDemo: React.FC = () => {
  // Sample placeholder image
  const placeholderImage = 'https://via.placeholder.com/150';
  
  return (
    <DemoContainer>
      <h2>User Avatar Component</h2>
      
      <AvatarRow>
        <DemoLabel>Default (32px):</DemoLabel>
        <UserAvatar 
          src={placeholderImage} 
          alt="Default avatar" 
        />
      </AvatarRow>
      
      <AvatarRow>
        <DemoLabel>Small (24px):</DemoLabel>
        <UserAvatar 
          src={placeholderImage} 
          alt="Small avatar" 
          size={24}
        />
      </AvatarRow>
      
      <AvatarRow>
        <DemoLabel>Large (64px):</DemoLabel>
        <UserAvatar 
          src={placeholderImage} 
          alt="Large avatar" 
          size={64}
        />
      </AvatarRow>
      
      <AvatarRow>
        <DemoLabel>Clickable:</DemoLabel>
        <UserAvatar 
          src={placeholderImage} 
          alt="Clickable avatar" 
          size={48}
          onClick={() => alert('Avatar clicked!')}
        />
      </AvatarRow>
    </DemoContainer>
  );
};

export default UserAvatarDemo;