import React from 'react';
import { DataTableRow } from '../../../shared/components/ui/DataTableRow';
import { CellData, DataTableRowStatusVariant } from '../../../shared/components/ui/DataTableRow/types';

interface ContainerDataRowProps {
  variety?: string;
  tenantId?: string | number;
  phase?: string | number;
  sowingDate?: string;
  harvestDate?: string;
  shipDate?: string;
  batchSize?: string | number;
  status?: 'active' | 'inactive' | 'pending' | 'warning' | 'error';
  onClick?: () => void;
  loading?: boolean;
  error?: string;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ContainerDataRow: React.FC<ContainerDataRowProps> = ({
  variety = 'N/A',
  tenantId = 'N/A',
  phase = 'N/A',
  sowingDate = 'N/A',
  harvestDate = 'N/A',
  shipDate = 'N/A',
  batchSize = 'N/A',
  status = 'inactive',
  onClick,
  loading,
  error,
  selected,
  disabled,
  className,
}) => {
  const cells: CellData[] = [
    {
      id: 'variety',
      type: 'text',
      content: variety,
      fontWeight: 'medium',
      flex: true,
      alignment: 'left',
      ariaLabel: `Variety: ${variety}`,
    },
    {
      id: 'tenantId',
      type: 'text',
      content: String(tenantId),
      width: 120,
      alignment: 'center',
      ariaLabel: `Cultivation Area: ${tenantId}`,
    },
    {
      id: 'phase',
      type: 'text',
      content: String(phase),
      width: 100,
      alignment: 'center',
      ariaLabel: `Nursery Table: ${phase}`,
    },
    {
      id: 'sowingDate',
      type: 'text',
      content: sowingDate,
      width: 100,
      alignment: 'center',
      ariaLabel: `Last SD: ${sowingDate}`,
    },
    {
      id: 'harvestDate',
      type: 'text',
      content: harvestDate,
      width: 100,
      alignment: 'center',
      ariaLabel: `Last TD: ${harvestDate}`,
    },
    {
      id: 'shipDate',
      type: 'text',
      content: shipDate,
      width: 100,
      alignment: 'center',
      ariaLabel: `Last HD: ${shipDate}`,
    },
    {
      id: 'batchSize',
      type: 'text',
      content: String(batchSize).split(' ')[1] || String(batchSize),
      width: 80,
      alignment: 'center',
      ariaLabel: `Avg Age: ${String(batchSize).split(' ')[1] || batchSize}`,
    },
    {
      id: 'status',
      type: 'text',
      content: status === 'warning' ? (String(batchSize).split(' ')[0] || '2') + ' days' : '0',
      width: 100,
      alignment: 'center',
      ariaLabel: `Overdue: ${status === 'warning' ? String(batchSize).split(' ')[0] : '0'}`,
    },
  ];

  return (
    <DataTableRow
      cells={cells}
      onClick={onClick}
      loading={loading}
      error={error}
      selected={selected}
      disabled={disabled}
      variant="default"
      size="sm"
      clickable={!!onClick}
      className={className}
      ariaLabel={`Container data row for ${variety}`}
    />
  );
};

export default ContainerDataRow;