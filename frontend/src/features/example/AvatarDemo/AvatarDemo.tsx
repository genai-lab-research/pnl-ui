import React from 'react';
import styled from '@emotion/styled';
import { Avatar } from '../../../shared/components/ui/Avatar';

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

const AvatarDemo: React.FC = () => {
  // Sample placeholder image
  const placeholderImage = 'https://via.placeholder.com/150';
  
  return (
    <DemoContainer>
      <h2>Avatar Component</h2>
      
      <AvatarRow>
        <DemoLabel>Default:</DemoLabel>
        <Avatar 
          src={placeholderImage} 
          alt="Default avatar" 
        />
      </AvatarRow>
      
      <AvatarRow>
        <DemoLabel>Clickable:</DemoLabel>
        <Avatar 
          src={placeholderImage} 
          alt="Clickable avatar" 
          onClick={() => alert('Avatar clicked!')}
        />
      </AvatarRow>
    </DemoContainer>
  );
};

export default AvatarDemo;