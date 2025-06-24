import React from 'react';
import { DataGridRow } from '../../shared/components/ui';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 24px;
`;

const Header = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  margin-bottom: 16px;
`;

const DataGridRowDemo: React.FC = () => {
  return (
    <Container>
      <Header>Data Grid Row Example</Header>
      <DataGridRow
        cropName="Rex Butterhead"
        generation={65}
        cycles={10}
        seedingDate="2025-01-10"
        harvestDate="2025-01-20"
        inspectionDate="2025-01-01"
        beds={22}
        status={{
          type: 'active',
          count: 0
        }}
      />
      <DataGridRow
        cropName="Kale Green"
        generation={42}
        cycles={15}
        seedingDate="2025-02-15"
        harvestDate="2025-03-10"
        inspectionDate="2025-02-01"
        beds={18}
        status={{
          type: 'active',
          count: 3
        }}
      />
    </Container>
  );
};

export default DataGridRowDemo;