import React, { useState } from 'react';
import styled from '@emotion/styled';
import TabGroup from '../../shared/components/ui/TabGroup';
import { TabOption } from '../../shared/components/ui/TabGroup/types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
`;

const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 500;
  margin: 0;
`;

const Content = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
`;

const timeOptions: TabOption[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
];

const TabGroupDemo: React.FC = () => {
  const [activeTimeFrame, setActiveTimeFrame] = useState('week');

  return (
    <Container>
      <Title>Time Range Selection</Title>
      <TabGroup 
        options={timeOptions} 
        value={activeTimeFrame} 
        onChange={setActiveTimeFrame} 
      />
      <Content>
        <p>Selected time frame: <strong>{activeTimeFrame}</strong></p>
        <p>This content would change based on the selected tab.</p>
      </Content>
    </Container>
  );
};

export default TabGroupDemo;