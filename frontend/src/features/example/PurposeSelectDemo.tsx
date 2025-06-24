import React, { useState } from 'react';
import { PurposeSelect } from '../../shared/components/ui/PurposeSelect';
import styled from '@emotion/styled';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h2`
  font-family: Roboto, sans-serif;
  font-size: 18px;
  margin: 0;
`;

const PurposeSelectDemo: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <DemoContainer>
      <h1>Purpose Select Component Demo</h1>
      
      <Section>
        <Title>Default State</Title>
        <PurposeSelect />
      </Section>
      
      <Section>
        <Title>With Selected Value</Title>
        <PurposeSelect value={selectedValue} onChange={handleChange} />
        <div>Selected value: {selectedValue || 'None'}</div>
      </Section>
      
      <Section>
        <Title>Custom Width</Title>
        <PurposeSelect width="300px" />
      </Section>
      
      <Section>
        <Title>Disabled State</Title>
        <PurposeSelect disabled />
      </Section>
    </DemoContainer>
  );
};

export default PurposeSelectDemo;