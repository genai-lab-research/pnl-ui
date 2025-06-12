import React from 'react';
import { Box, Switch, Typography } from '@mui/material';

import { ClearFiltersButton } from '../../../shared/components/ui/Button';
import SearchInput from '../../../shared/components/ui/SearchInput/SearchInput';
import SelectFilter from '../../../shared/components/ui/SelectFilter/SelectFilter';
                       
import { enumToOptions } from '../../../shared/utils/enumToOptions';
import { ContainerStatus, ContainerPurpose, ContainerType } from '../../../shared/types/containers';

export interface FilterSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  containerType: string;
  onContainerTypeChange: (value: string) => void;
  tenant: string;
  onTenantChange: (value: string) => void;
  tenantOptions?: { id: string; name: string }[];
  purpose: string;
  onPurposeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  hasAlerts: boolean;
  onHasAlertsChange: (value: boolean) => void;
  onClearFilters: () => void;
  className?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchValue,
  onSearchChange,
  onSearch,
  containerType,
  onContainerTypeChange,
  tenant,
  onTenantChange,
  tenantOptions = [],
  purpose,
  onPurposeChange,
  status,
  onStatusChange,
  hasAlerts,
  onHasAlertsChange,
  onClearFilters,
  className,
}) => {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <Box>
        <SearchInput
          placeholder="Search containers..."
          value={searchValue}
          onChange={onSearchChange}
          onSearch={onSearch}
        />
      </Box>

      <Box sx={{ flex: '1 1 140px', maxWidth: '180px' }}>
        <SelectFilter
          id="type-filter"
          value={containerType}
          onChange={onContainerTypeChange}
          options={[
            { value: 'all', label: 'All types' },
            ...enumToOptions(ContainerType),
          ]}
        />
      </Box>

      <Box sx={{ flex: '1 1 140px', maxWidth: '180px' }}>
        <SelectFilter
          id="tenant-filter"
          value={tenant}
          onChange={onTenantChange}
          options={[
            { value: 'all', label: 'All tenants' },
            ...tenantOptions.map((t) => ({ value: t.id, label: t.name })),
          ]}
        />
      </Box>

      <Box sx={{ flex: '1 1 140px', maxWidth: '180px' }}>
        <SelectFilter
          id="purpose-filter"
          value={purpose}
          onChange={onPurposeChange}
          options={[
            { value: 'all', label: 'All purposes' },
            ...enumToOptions(ContainerPurpose),
          ]}
        />
      </Box>

      <Box sx={{ flex: '1 1 140px', maxWidth: '180px' }}>
        <SelectFilter
          id="status-filter"
          value={status}
          onChange={onStatusChange}
          options={[
            { value: 'all', label: 'All statuses' },
            ...enumToOptions(ContainerStatus),
          ]}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <Typography variant="body2" sx={{ mr: 1, fontSize: '0.875rem', color: '#616161' }}>
          Has Alerts
        </Typography>
        <Switch
          checked={hasAlerts}
          onChange={(e) => onHasAlertsChange(e.target.checked)}
          color="primary"
          size="medium"
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#2196f3',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#2196f3',
            },
          }}
        />
      </Box>

      <ClearFiltersButton onClick={onClearFilters} />
    </Box>
  );
};

export default FilterSection;
