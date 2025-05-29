import React from 'react';
import { Table, TableRowData } from '../shared/components/ui/Table';
import { Chip } from '../shared/components/ui/Chip';
import ErrorIcon from '@mui/icons-material/Error';

export const TableExample: React.FC = () => {
  // Sample data that mimics the structure from the Figma design
  const columns = [
    { id: 'type', label: 'Type' },
    { id: 'seedType', label: 'Seed Type', width: '18%' },
    { id: 'cultivationArea', label: 'Cultivation Area', width: '12%', align: 'left' as const },
    { id: 'nurseryTable', label: 'Nursery Table', width: '12%', align: 'left' as const },
    { id: 'lastSD', label: 'Last SD', width: '12%', align: 'left' as const },
    { id: 'lastTD', label: 'Last TD', width: '12%', align: 'left' as const },
    { id: 'lastHD', label: 'Last HD', width: '12%', align: 'left' as const },
    { id: 'avgAge', label: 'Avg Age', width: '10%', align: 'left' as const },
    { id: 'overdue', label: 'Overdue', width: '12%', align: 'center' as const, 
      renderCell: (row: TableRowData) => {
        const overdueValue = row.overdue as number;
        if (overdueValue === 0) {
          return <Chip value={overdueValue} status="active" />;
        } else if (overdueValue > 0) {
          return <Chip value={overdueValue} status="in-progress" />;
        } else {
          return <ErrorIcon style={{ color: '#FF0000' }} />;
        }
      }
    }
  ];

  const rows = [
    { 
      type: 'icon', 
      seedType: 'Salanova Cousteau', 
      cultivationArea: '40', 
      nurseryTable: '30', 
      lastSD: '2025-01-30', 
      lastTD: '2025-01-30', 
      lastHD: '--', 
      avgAge: '26', 
      overdue: 2 
    },
    { 
      type: 'icon', 
      seedType: 'Kiribati', 
      cultivationArea: '50', 
      nurseryTable: '20', 
      lastSD: '2025-01-30', 
      lastTD: '2025-01-30', 
      lastHD: '--', 
      avgAge: '30', 
      overdue: 0 
    },
    { 
      type: 'icon', 
      seedType: 'Rex Butterhead', 
      cultivationArea: '65', 
      nurseryTable: '10', 
      lastSD: '2025-01-10', 
      lastTD: '2025-01-20', 
      lastHD: '2025-01-01', 
      avgAge: '22', 
      overdue: 0 
    },
    { 
      type: 'icon', 
      seedType: 'Lollo Rossa', 
      cultivationArea: '35', 
      nurseryTable: '25', 
      lastSD: '2025-01-15', 
      lastTD: '2025-01-20', 
      lastHD: '2025-05-02', 
      avgAge: '18', 
      overdue: 11 
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Vertical Farming Control Panel</h2>
      <Table
        columns={columns}
        rows={rows}
        zebraStriping={false}
        borderColor="#E9EDF4"
        headerBgColor="#F5F5F7"
        headerTextColor="rgba(76, 78, 100, 0.87)"
      />
    </div>
  );
};

export default TableExample;