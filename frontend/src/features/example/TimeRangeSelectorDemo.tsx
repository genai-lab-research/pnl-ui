import React, { useState } from 'react';
import { TimeRangeSelector, TimeRange } from '../../shared/components/ui/TimeRangeSelector';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  margin-bottom: 16px;
`;

const SelectedValue = styled.div`
  font-family: 'Roboto', sans-serif;
  margin-top: 16px;
  font-size: 14px;
`;

export const TimeRangeSelectorDemo: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('Week');

  return (
    <Container>
      <Title>Time Range Selector Component</Title>
      <TimeRangeSelector 
        selectedRange={selectedRange} 
        onRangeChange={setSelectedRange} 
      />
      <SelectedValue>Selected: {selectedRange}</SelectedValue>
    </Container>
  );
};

export default TimeRangeSelectorDemo;