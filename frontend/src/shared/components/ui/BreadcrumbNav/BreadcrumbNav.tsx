import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useIsXs } from '../../../utils/responsive';
import Avatar from '../Avatar/Avatar';

export interface BreadcrumbNavProps {
  /**
   * The text to display in the breadcrumb
   */
  breadcrumb: string;

  /**
   * Function to be called when the back button is clicked
   */
  onBackClick: () => void;

  /**
   * URL for the avatar image (optional)
   */
  avatarSrc?: string;

  /**
   * Alternative text for the avatar (optional)
   */
  avatarAlt?: string;

  /**
   * Additional CSS class name
   */
  className?: string;
}

const BreadcrumbContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1, 1.5),
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const BreadcrumbSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const BreadcrumbText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '28px',
  color: '#000000',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  
  [theme.breakpoints.down('md')]: {
    maxWidth: 'calc(100vw - 120px)', // Account for avatar and back button
    fontSize: '13px',
  },
  
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'calc(100vw - 100px)', // Even smaller on mobile screens
    fontSize: '12px',
    lineHeight: '24px',
  },
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  
  [theme.breakpoints.down('sm')]: {
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
    },
  },
}));

/**
 * BreadcrumbNav component for the container dashboard
 * 
 * Displays a navigation breadcrumb with back button and avatar.
 * Fully responsive across all screen sizes.
 * 
 * @component
 * @example
 * ```tsx
 * <BreadcrumbNav
 *   breadcrumb="Container Dashboard / farm-container-04"
 *   onBackClick={() => navigate(-1)}
 *   avatarSrc="https://i.pravatar.cc/300"
 *   avatarAlt="User avatar"
 * />
 * ```
 */
const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  breadcrumb,
  onBackClick,
  avatarSrc,
  avatarAlt = 'User avatar',
  className,
}) => {
  const isExtraSmall = useIsXs();
  
  return (
    <BreadcrumbContainer className={className}>
      {/* Left Section: Breadcrumb Navigation */}
      <BreadcrumbSection>
        <IconButton 
          onClick={onBackClick} 
          size={isExtraSmall ? "small" : "medium"} 
          sx={{ p: isExtraSmall ? 0.5 : 0.75 }}
          aria-label="Go back"
        >
          <ArrowBackIcon fontSize={isExtraSmall ? "small" : "medium"} />
        </IconButton>
        <BreadcrumbText>
          {breadcrumb}
        </BreadcrumbText>
      </BreadcrumbSection>
      
      {/* Right Section: Avatar */}
      {avatarSrc && (
        <AvatarContainer>
          <Avatar 
            src={avatarSrc} 
            alt={avatarAlt}
            size={isExtraSmall ? "small" : "medium"} 
          />
        </AvatarContainer>
      )}
    </BreadcrumbContainer>
  );
};

export default BreadcrumbNav;