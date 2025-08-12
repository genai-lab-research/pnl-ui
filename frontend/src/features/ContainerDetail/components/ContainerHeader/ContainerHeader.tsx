import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { TabNavigation } from '../../../../shared/components/ui/TabNavigation';
import { NavigationBreadcrumb } from '../../../../shared/components/ui/NavigationBreadcrumb';
import { ContainerInfo } from '../../../../api/containerApiService';
import { ContainerDetailTab } from '../../types/container-detail';
import { useNavigate } from 'react-router-dom';
import { styles } from './ContainerHeader.styles';

interface ContainerHeaderProps {
  container: ContainerInfo;
  activeTab: ContainerDetailTab['id'];
  onTabChange: (tab: ContainerDetailTab['id']) => void;
}

export const ContainerHeader: React.FC<ContainerHeaderProps> = ({
  container,
  activeTab,
  onTabChange
}) => {
  const navigate = useNavigate();
  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'environment' as const, label: 'Environment & Recipes' },
    { id: 'inventory' as const, label: 'Inventory' },
    { id: 'devices' as const, label: 'Devices' }
  ];

  const getContainerTypeIcon = (type: string) => {
    return type === 'physical' ? '🏭' : '💻';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={styles.root}>
      <Box sx={styles.topSection}>
        <NavigationBreadcrumb
          label={`Container Dashboard / ${container.name}`}
          arrowDirection="left"
          onClick={() => navigate('/dashboard')}
          backgroundVariant="dark"
        />
      </Box>
      
      <Box sx={styles.infoSection}>
        <Box sx={styles.titleContainer}>
          <Typography variant="h4" sx={styles.title}>
            {container.name}
          </Typography>
        </Box>

          <Box sx={styles.metaInfo}>
            <Typography sx={styles.containerType}>
              {getContainerTypeIcon(container.type)} {container.type}
            </Typography>
            <Typography sx={styles.separator}>|</Typography>
            <Typography sx={styles.tenantName}>
              {container.tenant.name}
            </Typography>
            {container.location && (
              <>
                <Typography sx={styles.separator}>|</Typography>
                <Typography sx={styles.location}>
                  {typeof container.location === 'object' && container.location.city 
                    ? `${container.location.city}, ${container.location.country}`
                    : 'Location not specified'}
                </Typography>
              </>
            )}

        <Chip
          label={container.status}
          color={getStatusColor(container.status)}
          size="small"
          sx={styles.statusChip}
        />
          </Box>

        </Box>
      
      <Box sx={styles.tabSection}>
        <TabNavigation
          tabs={tabs}
          activeTabId={activeTab}
          onTabChange={onTabChange}
        />
      </Box>
    </Box>
  );
};