import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Container, Paper, Typography } from '@mui/material';

import { CreateContainerButton } from '../../shared/components/ui/Button';
import { Chip } from '../../shared/components/ui/Chip';
import { FilterChipContainer } from '../../shared/components/ui/Container/FilterChipContainer';
import { SearchInput } from '../../shared/components/ui/SearchInput';
import { DataTable } from '../../shared/components/ui/Table/DataTable';
import {
  Column,
  ContainerPurpose,
  ContainerStatus,
  ContainerType,
} from '../../shared/types/containers';

const columns: Column[] = [
  { id: 'type', label: 'Type', width: '10%' },
  { id: 'name', label: 'Name', width: '15%' },
  { id: 'tenant', label: 'Tenant', width: '10%' },
  { id: 'purpose', label: 'Purpose', width: '10%' },
  { id: 'location', label: 'Location', width: '15%' },
  { id: 'status', label: 'Status', width: '10%' },
  { id: 'created', label: 'Created', width: '8%' },
  { id: 'modified', label: 'Modified', width: '8%' },
  { id: 'alerts', label: 'Alerts', width: '7%' },
  { id: 'actions', label: 'Actions', width: '7%' },
];

const ContainerListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ContainerType | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<ContainerPurpose | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ContainerStatus | null>(null);

  // API filters state
  const [apiFilters, setApiFilters] = useState<Record<string, any>>({
    limit: 10,
    skip: 0,
  });

  const handleSearch = () => {
    const filters: Record<string, any> = {
      limit: 10,
      skip: 0,
    };

    if (searchTerm) {
      filters.name = searchTerm;
    }

    if (selectedType) {
      filters.type = selectedType;
    }

    if (selectedPurpose) {
      filters.purpose = selectedPurpose;
    }

    if (selectedStatus) {
      filters.status = selectedStatus;
    }

    setApiFilters(filters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType(null);
    setSelectedPurpose(null);
    setSelectedStatus(null);
    setApiFilters({
      limit: 10,
      skip: 0,
    });
  };

  const handleRowClick = (row: any) => {
    // Navigate to container details page
    navigate(`/containers/${row.id}`);
  };

  const handleActionClick = (row: any) => {
    console.log('Action clicked for row:', row);
    // In a real application, this would open a menu or modal for actions
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Containers</Typography>
          <CreateContainerButton onContainerCreated={handleSearch} />
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e)}

              placeholder="Search containers..."
             
            />
            <Button variant="contained" sx={{ ml: 2 }} onClick={handleSearch}>
              Search
            </Button>
            <Button variant="outlined" sx={{ ml: 2 }} onClick={clearFilters}>
              Clear
            </Button>
          </Box>

          <FilterChipContainer>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Filter by:
            </Typography>

            <Chip
              label="Physical"
              onClick={() => setSelectedType(ContainerType.PHYSICAL)}
              onDelete={
                selectedType === ContainerType.PHYSICAL ? () => setSelectedType(null) : undefined
              }
              color={selectedType === ContainerType.PHYSICAL ? 'primary' : 'default'}
            />

            <Chip
              label="Virtual"
              onClick={() => setSelectedType(ContainerType.VIRTUAL)}
              onDelete={
                selectedType === ContainerType.VIRTUAL ? () => setSelectedType(null) : undefined
              }
              color={selectedType === ContainerType.VIRTUAL ? 'primary' : 'default'}
            />

            <Chip
              label="Development"
              onClick={() => setSelectedPurpose(ContainerPurpose.DEVELOPMENT)}
              onDelete={
                selectedPurpose === ContainerPurpose.DEVELOPMENT
                  ? () => setSelectedPurpose(null)
                  : undefined
              }
              color={selectedPurpose === ContainerPurpose.DEVELOPMENT ? 'primary' : 'default'}
            />

            <Chip
              label="Production"
              onClick={() => setSelectedPurpose(ContainerPurpose.PRODUCTION)}
              onDelete={
                selectedPurpose === ContainerPurpose.PRODUCTION
                  ? () => setSelectedPurpose(null)
                  : undefined
              }
              color={selectedPurpose === ContainerPurpose.PRODUCTION ? 'primary' : 'default'}
            />

            <Chip
              label="Active"
              onClick={() => setSelectedStatus(ContainerStatus.ACTIVE)}
              onDelete={
                selectedStatus === ContainerStatus.ACTIVE
                  ? () => setSelectedStatus(null)
                  : undefined
              }
              color={selectedStatus === ContainerStatus.ACTIVE ? 'primary' : 'default'}
            />

            <Chip
              label="Inactive"
              onClick={() => setSelectedStatus(ContainerStatus.INACTIVE)}
              onDelete={
                selectedStatus === ContainerStatus.INACTIVE
                  ? () => setSelectedStatus(null)
                  : undefined
              }
              color={selectedStatus === ContainerStatus.INACTIVE ? 'primary' : 'default'}
            />
          </FilterChipContainer>
        </Paper>

        <DataTable
          columns={columns}
          useApi={true}
          apiFilters={apiFilters}
          onRowClick={handleRowClick}
          onActionClick={handleActionClick}
        />
      </Box>
    </Container>
  );
};

export default ContainerListPage;
