import React from 'react';
import { BreadcrumbLink } from '../../../shared/components';
import styled from '@emotion/styled';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

/**
 * BreadcrumbLinkDemo Component
 * 
 * Demonstrates the BreadcrumbLink component with various configurations.
 */
export const BreadcrumbLinkDemo: React.FC = () => {
  return (
    <DemoContainer>
      <Title>BreadcrumbLink Component Demo</Title>
      
      <Section>
        <Title>Default BreadcrumbLink</Title>
        <BreadcrumbLink 
          path="Container Management / farm-container-04" 
          onClick={() => console.log('Clicked default breadcrumb')}
        />
      </Section>

      <Section>
        <Title>Custom Path BreadcrumbLink</Title>
        <BreadcrumbLink 
          path="Dashboard / Statistics / Monthly" 
          onClick={() => console.log('Clicked custom breadcrumb')}
        />
      </Section>

      <Section>
        <Title>Simple BreadcrumbLink</Title>
        <BreadcrumbLink 
          path="Container Management" 
          onClick={() => console.log('Clicked simple breadcrumb')}
        />
      </Section>
    </DemoContainer>
  );
};
