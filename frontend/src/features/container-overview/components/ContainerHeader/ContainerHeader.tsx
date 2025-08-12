import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Tab, 
  Tabs, 
  IconButton, 
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  AccountCircle as UserIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { BreadcrumbItem, TabType } from '../../models/container-overview.model';
import { containerHeaderStyles } from './ContainerHeader.styles';

interface ContainerHeaderProps {
  containerName: string;
  containerType: string;
  tenantName: string;
  location?: string;
  status: string;
  statusColor: 'success' | 'warning' | 'error' | 'info';
  containerIconType: string;
  breadcrumbs: BreadcrumbItem[];
  tabs: TabType[];
  activeTab: string;
  isLoading?: boolean;
  onBreadcrumbClick: () => void;
  onTabChange: (tabKey: string) => void;
  onRefresh: () => void;
}

export const ContainerHeader: React.FC<ContainerHeaderProps> = ({
  containerName,
  containerType,
  tenantName,
  location,
  status,
  statusColor,
  containerIconType,
  breadcrumbs,
  tabs,
  activeTab,
  isLoading = false,
  onBreadcrumbClick,
  onTabChange,
  onRefresh,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getStatusChipColor = () => {
    switch (statusColor) {
      case 'success':
        return { backgroundColor: '#E8F5E8', color: '#2E7D32' };
      case 'warning':
        return { backgroundColor: '#FFF3E0', color: '#F57C00' };
      case 'error':
        return { backgroundColor: '#FFEBEE', color: '#D32F2F' };
      default:
        return { backgroundColor: '#E3F2FD', color: '#1976D2' };
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  if (isLoading) {
    return (
      <Box sx={containerHeaderStyles.root}>
        <Box sx={containerHeaderStyles.topBar}>
          <Skeleton variant="rectangular" width={296} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        
        <Box sx={containerHeaderStyles.mainHeader}>
          <Box sx={containerHeaderStyles.titleSection}>
            <Skeleton variant="text" width={300} height={36} />
            <Box sx={containerHeaderStyles.metadata}>
              <Skeleton variant="text" width={150} height={20} />
              <Skeleton variant="text" width={100} height={20} />
            </Box>
          </Box>
          <Skeleton variant="rectangular" width={120} height={32} />
        </Box>
        
        <Box sx={containerHeaderStyles.tabsContainer}>
          <Skeleton variant="rectangular" width={400} height={40} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={containerHeaderStyles.root}>
      {/* Top Navigation Bar */}
      <Box sx={containerHeaderStyles.topBar}>
        <Box sx={containerHeaderStyles.breadcrumb} onClick={onBreadcrumbClick}>
          <ArrowBackIcon sx={{ fontSize: 16, mr: 1 }} />
          <Typography variant="body2" sx={containerHeaderStyles.breadcrumbText}>
            {breadcrumbs[0]?.label || 'Container Management Dashboard'}
          </Typography>
        </Box>
        
        <Box sx={containerHeaderStyles.userSection}>
          <IconButton 
            size="small" 
            onClick={onRefresh}
            sx={containerHeaderStyles.refreshButton}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <UserIcon sx={containerHeaderStyles.userIcon} />
        </Box>
      </Box>

      {/* Main Header */}
      <Box sx={containerHeaderStyles.mainHeader}>
        <Box sx={containerHeaderStyles.titleSection}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={containerHeaderStyles.containerName}
          >
            {containerName}
          </Typography>
          
          <Box sx={containerHeaderStyles.metadata}>
            <Typography variant="body2" sx={containerHeaderStyles.metadataItem}>
              {containerType}
            </Typography>
            {tenantName && (
              <Typography variant="body2" sx={containerHeaderStyles.metadataItem}>
                • {tenantName}
              </Typography>
            )}
            {location && (
              <Typography variant="body2" sx={containerHeaderStyles.metadataItem}>
                • {location}
              </Typography>
            )}
          </Box>
        </Box>

        <Chip
          label={status}
          size="medium"
          sx={{
            ...containerHeaderStyles.statusChip,
            ...getStatusChipColor(),
          }}
        />
      </Box>

      {/* Tab Navigation */}
      <Box sx={containerHeaderStyles.tabsContainer}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={containerHeaderStyles.tabs}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              label={tab.label}
              value={tab.key}
              sx={containerHeaderStyles.tab}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};
