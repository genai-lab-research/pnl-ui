import React from 'react';
import { NavigationLink } from '../../shared/components/NavigationLink';
import styled from '@emotion/styled';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  margin-bottom: 16px;
`;

const NavigationLinkDemo: React.FC = () => {
  const handleClick = () => {
    alert('Navigation link clicked!');
  };

  return (
    <DemoContainer>
      <Title>Navigation Link Demo</Title>
      <NavigationLink 
        text="Container Dashboard / farm-container-04" 
        onClick={handleClick}
      />
    </DemoContainer>
  );
};

export default NavigationLinkDemo;