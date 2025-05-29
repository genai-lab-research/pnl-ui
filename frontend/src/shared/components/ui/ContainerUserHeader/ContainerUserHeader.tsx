import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';

export interface ContainerUserHeaderProps {
  /**
   * The main title text
   */
  title: string;
  
  /**
   * Date/time string
   */
  timestamp?: string;
  
  /**
   * User name string
   */
  userName?: string;
  
  /**
   * Background color for the avatar
   * @default "#489F68" (green)
   */
  avatarColor?: string;
  
  /**
   * Optional custom icon for the avatar
   */
  avatarIcon?: React.ReactNode;
  
  /**
   * Custom CSS class for the container
   */
  className?: string;
}

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderBottom: '1px solid',
  borderColor: 'rgba(69, 81, 104, 0.1)',
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1.5),
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  
  [theme.breakpoints.down('md')]: {
    width: 36,
    height: 36,
  },
  
  [theme.breakpoints.down('sm')]: {
    width: 32,
    height: 32,
  }
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(1.5),
  }
}));

const MetadataContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  alignItems: 'center',
  
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
  }
}));

const TimestampContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

/**
 * ContainerUserHeader component displays a header with a user avatar, title, timestamp, and username.
 * 
 * @component
 * @example
 * ```tsx
 * <ContainerUserHeader
 *   title="Seeded Salanova Cousteau in Nursery"
 *   timestamp="April 13, 2025 - 12:30 PM"
 *   userName="Emily Chen"
 * />
 * ```
 */
export const ContainerUserHeader: React.FC<ContainerUserHeaderProps> = ({
  title,
  timestamp,
  userName,
  avatarColor = '#489F68',
  avatarIcon,
  className,
}) => {
  return (
    <StyledContainer className={clsx('container-user-header', className)}>
      <StyledAvatar sx={{ bgcolor: avatarColor }}>
        {avatarIcon || <PersonIcon />}
      </StyledAvatar>
      
      <ContentContainer>
        <Typography
          variant="body1"
          fontWeight={500}
          className="text-black overflow-hidden text-ellipsis"
          sx={{ 
            fontSize: '14px', 
            lineHeight: '20px',
            mb: 0.5, 
            whiteSpace: { xs: 'normal', sm: 'nowrap' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
        
        <MetadataContainer>
          {timestamp && (
            <TimestampContainer>
              <ScheduleIcon 
                sx={{ 
                  color: 'rgba(69, 81, 104, 0.5)', 
                  fontSize: '16px',
                  mr: 0.5,
                  opacity: 0.5,
                }} 
              />
              <Typography 
                variant="body2" 
                color="#71717A"
                sx={{ 
                  fontSize: '12px',
                  lineHeight: '16px',
                }}
              >
                {timestamp}
              </Typography>
            </TimestampContainer>
          )}
          
          {userName && (
            <Typography 
              variant="body2" 
              color="#71717A"
              sx={{ 
                fontSize: '12px',
                lineHeight: '16px',
              }}
            >
              {userName}
            </Typography>
          )}
        </MetadataContainer>
      </ContentContainer>
    </StyledContainer>
  );
};

export default ContainerUserHeader;