import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Chip from '../Chip/Chip';

export type ContainerHeaderStatus = 'active' | 'inactive' | 'in-progress' | 'default';

export interface ContainerHeaderProps {
  /**
   * The title of the container
   */
  title: string;
  
  /**
   * The metadata text to display
   */
  metadata: string;
  
  /**
   * The status of the container
   * @default 'active'
   */
  status?: ContainerHeaderStatus;
  
  /**
   * Optional class name for custom styling
   */
  className?: string;
}

const HeaderContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 0),
  gap: theme.spacing(2),
  
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  }
}));

const TitleContainer = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  fontSize: '30px',
  lineHeight: '36px',
  letterSpacing: '-0.75px',
  color: '#000000',
  marginRight: 'auto',
  
  [theme.breakpoints.down('md')]: {
    fontSize: '26px',
    lineHeight: '32px',
  },
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '22px',
    lineHeight: '28px',
    width: '100%', // Take full width on mobile
    marginRight: 0,
  }
}));

const MetadataContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginRight: theme.spacing(1),
  
  [theme.breakpoints.down('sm')]: {
    flexGrow: 1,
    order: 2,
    marginRight: 0,
  }
}));

const MetadataText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '17px',
  color: '#71717A', // Extracted from Figma
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  
  '@media (max-width: 375px)': {
    maxWidth: '150px',
  }
}));

const StatusContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: 1,
    marginLeft: 'auto',
  }
}));

/**
 * ContainerHeader component
 * 
 * A component that displays a container header with a title, metadata, and status indicator.
 * This component is fully responsive and adapts to different screen sizes while maintaining
 * a visually appealing appearance.
 * 
 * @component
 * @example
 * ```tsx
 * <ContainerHeader 
 *   title="farm-container-04"
 *   metadata="Physical container | Tenant-123 | Development"
 *   status="active"
 * />
 * ```
 * 
 * ## Responsive Behavior
 * - Desktop (≥900px): Full layout with all elements in a row
 * - Tablet (600px-899px): Reduced horizontal spacing but maintain all elements
 * - Mobile (<600px): Title takes full width, metadata and status chip on row below
 * 
 * The component maintains its clean, readable appearance across all device sizes
 * while preserving the visual hierarchy between elements.
 */
export const ContainerHeader: React.FC<ContainerHeaderProps> = ({
  title,
  metadata,
  status = 'active',
  className,
}) => {
  return (
    <HeaderContainer className={className}>
      <TitleContainer variant="h1" component="h1">
        {title}
      </TitleContainer>
      
      <MetadataContainer>
        <MetadataText variant="body2" component="p">
          {metadata}
        </MetadataText>
      </MetadataContainer>
      
      <StatusContainer>
        <Chip value={status} status={status} variant="filled" />
      </StatusContainer>
    </HeaderContainer>
  );
};

export default ContainerHeader;