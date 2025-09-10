import React from 'react';
import { Dashboard, GridView } from '@mui/icons-material';
import { ToggleGroup } from '../../../../../../shared/components/ui/ToggleGroup';
import type { ToggleOption } from '../../../../../../shared/components/ui/ToggleGroup/types';

interface AreaToggleProps {
  activeArea: 'nursery' | 'cultivation';
  onAreaChange: (area: string) => void;
}

/**
 * Domain component for switching between Nursery Station and Cultivation Area views
 * Wraps the atomic ToggleGroup component with inventory-specific options
 */
export const AreaToggle: React.FC<AreaToggleProps> = ({ activeArea, onAreaChange }) => {
  const options: ToggleOption[] = [
    {
      id: 'nursery',
      label: 'Nursery Station',
      icon: <Dashboard />,
      ariaLabel: 'Switch to nursery station view'
    },
    {
      id: 'cultivation',
      label: 'Cultivation Area',
      icon: <GridView />,
      ariaLabel: 'Switch to cultivation area view'
    }
  ];

  const handleSelectionChange = (optionId: string | undefined) => {
    if (optionId) {
      onAreaChange(optionId);
    }
  };

  return (
    <ToggleGroup
      options={options}
      selectedId={activeArea}
      onSelectionChange={handleSelectionChange}
      variant="default"
      size="md"
      fullWidth={false}
      allowDeselection={false}
      ariaLabel="Select inventory area view"
    />
  );
};