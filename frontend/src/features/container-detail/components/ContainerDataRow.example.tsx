import React from 'react';
import { ContainerDataRow } from './ContainerDataRow';
import type { ContainerRowData } from './ContainerDataRow.types';

const sampleData: ContainerRowData[] = [
  {
    variety: 'Rex Butterhead',
    tenantId: '65',
    phase: '10',
    sowingDate: '2025-01-10',
    harvestDate: '2025-01-20',
    shipDate: '2025-01-01',
    batchSize: '22',
    status: 'active',
  },
  {
    variety: 'Green Oak Lettuce',
    tenantId: '42',
    phase: '8',
    sowingDate: '2025-01-12',
    harvestDate: '2025-01-22',
    shipDate: '2025-01-03',
    batchSize: '18',
    status: 'pending',
  },
  {
    variety: 'Red Coral Lettuce',
    tenantId: '38',
    phase: '12',
    sowingDate: '2025-01-08',
    harvestDate: '2025-01-18',
    shipDate: '2024-12-30',
    batchSize: '25',
    status: 'inactive',
  },
];

export const ContainerDataRowExample: React.FC = () => {
  const handleRowClick = (variety: string) => {
    console.log(`Clicked on ${variety} row`);
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2>Container Data Rows Example</h2>
      
      <div style={{ marginBottom: '24px' }}>
        <h3>Basic Usage</h3>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
          {sampleData.map((data, index) => (
            <ContainerDataRow
              key={`${data.variety}-${index}`}
              {...data}
              onClick={() => handleRowClick(data.variety)}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Loading State</h3>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
          <ContainerDataRow
            {...sampleData[0]}
            loading={true}
          />
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Error State</h3>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
          <ContainerDataRow
            {...sampleData[0]}
            error="Failed to load container data"
          />
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Selected State</h3>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
          <ContainerDataRow
            {...sampleData[0]}
            selected={true}
            onClick={() => handleRowClick(sampleData[0].variety)}
          />
        </div>
      </div>

      <div>
        <h3>Disabled State</h3>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
          <ContainerDataRow
            {...sampleData[0]}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ContainerDataRowExample;