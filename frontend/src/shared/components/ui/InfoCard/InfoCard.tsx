import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Chip, { ChipStatus } from '../Chip/Chip';

export interface ContainerInfoData {
  /**
   * Container name identifier
   */
  name: string;
  /**
   * Container ID number
   */
  id: string;
  /**
   * Container type category
   */
  type: string;
  /**
   * Tenant associated with the container
   */
  tenant: string;
  /**
   * Purpose of the container
   */
  purpose: string;
  /**
   * Physical location of the container
   */
  location: string;
  /**
   * Current status of the container (active, inactive, etc)
   */
  status: ChipStatus;
  /**
   * Creation date and time
   */
  created: string;
  /**
   * Last modification date and time
   */
  lastModified: string;
  /**
   * Creator of the container
   */
  creator: string;
  /**
   * Seed types contained
   */
  seedTypes: string;
  /**
   * Additional notes about the container
   */
  notes?: string;
  /**
   * Type icon component (optional)
   */
  typeIcon?: React.ReactNode;
}

export interface InfoCardProps {
  /**
   * Container information data
   */
  containerData: ContainerInfoData;
  /**
   * Additional CSS class name
   */
  className?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  width: '100%',

  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
    '&:last-child': {
      paddingBottom: theme.spacing(3),
    },
    
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
      '&:last-child': {
        paddingBottom: theme.spacing(2),
      },
    }
  }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(2),
  }
}));

const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(2),
  }
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),

  [theme.breakpoints.down('sm')]: {
    marginBottom: 0,
  }
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
  color: theme.palette.text.primary,
  wordBreak: 'break-word',
}));

const TypeDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/**
 * InfoCard component displays detailed information about a container
 * 
 * A responsive card component that displays container information in a structured
 * layout. The component adapts to different screen sizes and maintains consistent
 * styling across breakpoints.
 * 
 * @component
 * @example
 * ```tsx
 * const containerData = {
 *   name: "farm-container-04",
 *   id: "51",
 *   type: "Physical",
 *   tenant: "tenant-123",
 *   purpose: "Development",
 *   location: "Lviv",
 *   status: "active",
 *   created: "30/01/2025, 09:30",
 *   lastModified: "30/01/2025, 11:14",
 *   creator: "Mia Adams",
 *   seedTypes: "Someroots, sunflower, Someroots, Someroots",
 *   notes: "Primary production container for Farm A."
 * };
 * 
 * <InfoCard containerData={containerData} />
 * ```
 * 
 * ## Responsive Behavior
 * - On desktop (>= 1200px): Two-column layout with comfortable spacing
 * - On tablet (900px - 1199px): Two-column layout with slightly reduced spacing
 * - On mobile (< 900px): Single-column layout for information fields
 * - On small mobile (< 600px): Further reduced spacing
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  containerData,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledCard className={className}>
      <CardContent>
        {/* Header Section */}
        <HeaderSection>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.15px',
              marginBottom: 0.5
            }}
          >
            Container Information
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              lineHeight: '16.94px',
              color: '#71717A'
            }}
          >
            Basic details about this container.
          </Typography>
        </HeaderSection>

        {/* Info Section */}
        <ContentSection>
          <Grid container spacing={isSmallMobile ? 1 : 2}>
            {/* Name */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoLabel>Name</InfoLabel>
              <InfoValue>{containerData.name}</InfoValue>
            </Grid>
            
            {/* ID */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoLabel>ID</InfoLabel>
              <InfoValue>{containerData.id}</InfoValue>
            </Grid>
            
            {/* Type */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoLabel>Type</InfoLabel>
              <TypeDisplay>
                {containerData.typeIcon}
                <InfoValue>{containerData.type}</InfoValue>
              </TypeDisplay>
            </Grid>
            
            {/* Tenant */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoLabel>Tenant</InfoLabel>
              <InfoValue>{containerData.tenant}</InfoValue>
            </Grid>
            
            {/* Purpose */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoLabel>Purpose</InfoLabel>
              <InfoValue>{containerData.purpose}</InfoValue>
            </Grid>
            
            {/* Location */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>{containerData.location}</InfoValue>
            </Grid>
            
            {/* Status */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoLabel>Status</InfoLabel>
              <Chip 
                value={containerData.status === 'active' ? 'Active' : 
                      containerData.status === 'inactive' ? 'Inactive' :
                      containerData.status === 'in-progress' ? 'In Progress' : 'Default'}
                status={containerData.status}
                size="small"
              />
            </Grid>
            
            {/* Created */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoLabel>Created</InfoLabel>
              <InfoValue>{containerData.created}</InfoValue>
            </Grid>
            
            {/* Last Modified */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoLabel>Last Modified</InfoLabel>
              <InfoValue>{containerData.lastModified}</InfoValue>
            </Grid>
            
            {/* Creator */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoLabel>Creator</InfoLabel>
              <InfoValue>{containerData.creator}</InfoValue>
            </Grid>
            
            {/* Seed Type */}
            <Grid item xs={12}>
              <InfoLabel>Seed Type:</InfoLabel>
              <InfoValue>{containerData.seedTypes}</InfoValue>
            </Grid>
          </Grid>
        </ContentSection>

        {/* Notes Section */}
        {containerData.notes && (
          <>
            <Divider sx={{ my: isMobile ? 2 : 3 }} />
            <Box>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{
                  fontFamily: 'Roboto, sans-serif', 
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.15px',
                  marginBottom: 1
                }}
              >
                Notes
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  lineHeight: '16.94px',
                }}
              >
                {containerData.notes}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default InfoCard;