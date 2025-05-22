import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  Grid,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Link,
  Stack
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonIcon from '@mui/icons-material/Person';
import LaptopIcon from '@mui/icons-material/Laptop';
import HistoryIcon from '@mui/icons-material/History';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format, parseISO } from 'date-fns';

import { ContainerDetail, ContainerActivity } from '../../services/containerService';
import { InformationGroupContainer } from '../../shared/components/ui/Container';
import { ShippingContainerIcon, AvatarIcon } from '../../shared/components/ui/Icon';

export interface ContainerInfoSectionProps {
  container: ContainerDetail;
  activities: ContainerActivity[];
  className?: string;
}

// Helper component for displaying information rows
interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    width: '100%'
  }}>
    <Typography 
      variant="body2" 
      color="text.secondary" 
      sx={{ 
        fontWeight: 500,
        flexShrink: 0,
        mr: 2,
        width: '40%'
      }}
    >
      {label}
    </Typography>
    <Typography 
      variant="body2" 
      sx={{ 
        textAlign: 'right',
        width: '60%',
        wordBreak: 'break-word'
      }}
    >
      {value}
    </Typography>
  </Box>
);

// Helper component for activity items
interface ActivityItemProps {
  activity: ContainerActivity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'SEEDED':
        return <AvatarIcon size={40} />;
      case 'SYNCED':
        return <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}><LaptopIcon /></Avatar>;
      case 'ENVIRONMENT_CHANGED':
        return <AvatarIcon size={40} />;
      case 'CREATED':
        return <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}><LaptopIcon /></Avatar>;
      case 'MAINTENANCE':
        return <AvatarIcon size={40} />;
      default:
        return <Avatar sx={{ width: 40, height: 40, bgcolor: 'grey.400' }}>?</Avatar>;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      // Using April to match the reference design
      // Format: April 13, 2025 - 12:30 PM
      const date = parseISO(timestamp);
      return `${format(date, 'MMMM d, yyyy - h:mm')} ${format(date, 'a').toUpperCase()}`;
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <ListItem sx={{ px: 0, py: 2, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
      <ListItemIcon sx={{ minWidth: 56 }}>
        {getActivityIcon(activity.type)}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
            {activity.description}
          </Typography>
        }
        secondary={
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatTimestamp(activity.timestamp)}
            </Typography>
            {activity.user.name !== 'System' && (
              <Typography variant="caption" color="text.secondary">
                {activity.user.name}
              </Typography>
            )}
          </Stack>
        }
      />
    </ListItem>
  );
};

const ContainerInfoSection: React.FC<ContainerInfoSectionProps> = ({
  container,
  activities,
  className
}) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  
  // Toggle expanded state
  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Card 
      className={className}
      elevation={0}
      sx={{
        mb: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 3,
            borderBottom: expanded ? '1px solid' : 'none',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight="medium">
            Container Information & Settings
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>Edit</Typography>
            <IconButton aria-label="edit" sx={{ mr: 1 }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleExpandToggle} size="small">
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
        </Box>

        {expanded && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {/* Left Column - Container Information */}
              <Card 
                elevation={0} 
                sx={{ 
                  flex: '1 1 0', 
                  minWidth: 300, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  fontWeight="medium" 
                  sx={{ mb: 3 }}
                >
                  Container Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <InfoRow label="Name" value={`farm-container-04`} />
                  <InfoRow 
                    label="Type" 
                    value={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box component="span" sx={{ display: 'inline-block', mr: 1 }}>
                          <ShippingContainerIcon fontSize="small" />
                        </Box>
                        Physical
                      </Box>
                    } 
                  />
                  <InfoRow label="Tenant" value="tenant-123" />
                  <InfoRow label="Purpose" value={container.purpose} />
                  <InfoRow label="Location" value="Lviv" />
                  <InfoRow 
                    label="Status" 
                    value={
                      <Box component="span" sx={{ 
                        color: 'white', 
                        bgcolor: 'success.main',
                        px: 2,
                        py: 0.5,
                        borderRadius: 10,
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        Active
                      </Box>
                    } 
                  />
                  <InfoRow 
                    label="Created" 
                    value={"30/01/2025, 09:30"} 
                  />
                  <InfoRow 
                    label="Last Modified" 
                    value={"30/01/2025, 11:14"} 
                  />
                  <InfoRow label="Creator" value="Mia Adams" />
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                      Seed Type:
                    </Typography>
                    <Typography variant="body2">
                      Someroots, sunflower, Someroots, Someroots
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                      Notes
                    </Typography>
                    <Typography variant="body2">
                      Primary production container for Farm A.
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {/* Middle Column - System Settings */}
              <Card 
                elevation={0} 
                sx={{ 
                  flex: '1 1 0', 
                  minWidth: 300, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  fontWeight="medium" 
                  sx={{ mb: 3 }}
                >
                  System Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Container Options
                    </Typography>
                    <InfoRow 
                      label="Enable Shadow Service" 
                      value="No" 
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      System Integration
                    </Typography>
                    <InfoRow 
                      label="Connect to external systems" 
                      value="Yes" 
                    />
                    <InfoRow 
                      label="FA Integration" 
                      value={
                        <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
                          Alpha
                          <OpenInNewIcon fontSize="small" sx={{ ml: 0.5, fontSize: '1rem' }} />
                        </Link>
                      } 
                    />
                    <InfoRow 
                      label="FA Integration" 
                      value={
                        <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
                          Dev
                          <OpenInNewIcon fontSize="small" sx={{ ml: 0.5, fontSize: '1rem' }} />
                        </Link>
                      } 
                    />
                    <InfoRow 
                      label="AWS Environment" 
                      value={
                        <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
                          Dev
                          <OpenInNewIcon fontSize="small" sx={{ ml: 0.5, fontSize: '1rem' }} />
                        </Link>
                      } 
                    />
                    <InfoRow 
                      label="MBAI Environment" 
                      value={
                        <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
                          Disabled
                          <OpenInNewIcon fontSize="small" sx={{ ml: 0.5, fontSize: '1rem' }} />
                        </Link>
                      } 
                    />
                  </Box>
                </Box>
              </Card>

              {/* Right Column - Activity Log */}
              <Card 
                elevation={0} 
                sx={{ 
                  flex: '1 1 0', 
                  minWidth: 300, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  fontWeight="medium" 
                  sx={{ mb: 3 }}
                >
                  Activity Log
                </Typography>
                <List sx={{ width: '100%', p: 0 }}>
                  {activities && activities.length > 0 ? (
                    activities.slice(0, 5).map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))
                  ) : (
                    <>
                      <ActivityItem
                        activity={{
                          id: '1',
                          type: 'SEEDED',
                          description: 'Seeded Salanova Cousteau in Nursery',
                          timestamp: '2025-04-13T12:30:00Z',
                          user: { id: '1', name: 'Emily Chen' }
                        }}
                      />
                      <ActivityItem
                        activity={{
                          id: '2',
                          type: 'SYNCED',
                          description: 'Data synced',
                          timestamp: '2025-04-13T09:45:00Z',
                          user: { id: '2', name: 'System' }
                        }}
                      />
                      <ActivityItem
                        activity={{
                          id: '3',
                          type: 'ENVIRONMENT_CHANGED',
                          description: 'Environment mode switched to Auto',
                          timestamp: '2025-04-10T10:00:00Z',
                          user: { id: '3', name: 'Markus Johnson' }
                        }}
                      />
                      <ActivityItem
                        activity={{
                          id: '4',
                          type: 'CREATED',
                          description: 'Container created',
                          timestamp: '2025-04-10T09:00:00Z',
                          user: { id: '2', name: 'System' }
                        }}
                      />
                      <ActivityItem
                        activity={{
                          id: '5',
                          type: 'MAINTENANCE',
                          description: 'Container maintenance performed',
                          timestamp: '2025-04-09T10:00:00Z',
                          user: { id: '4', name: 'Maintenance Team' }
                        }}
                      />
                    </>
                  )}
                </List>
              </Card>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ContainerInfoSection;