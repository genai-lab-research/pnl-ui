import React from 'react';

import { Avatar, Box, Divider, SxProps, Theme, Typography } from '@mui/material';

import { AvatarIcon } from '../Icon';

export interface HeaderContainerProps {
  /**
   * Page title
   */
  title: string;

  /**
   * User avatar URL or null to display default icon
   */
  avatarUrl?: string | null;

  /**
   * Optional user name for avatar alt text
   */
  userName?: string;

  /**
   * Optional children to render in the header (like action buttons)
   */
  children?: React.ReactNode;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Whether to show the bottom divider
   * @default true
   */
  withDivider?: boolean;

  /**
   * Optional sx props for custom styling
   */
  sx?: SxProps<Theme>;
}

/**
 * HeaderContainer component for page headers with title and user info
 */
export const HeaderContainer: React.FC<HeaderContainerProps> = ({
  title,
  avatarUrl,
  userName,
  children,
  className,
  withDivider = true,
  sx,
}) => {
  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: { xs: 1.5, sm: 2 },
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {children}

          {avatarUrl ? (
            <Avatar
              src={avatarUrl}
              alt={userName || 'User avatar'}
              sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 } }}
            />
          ) : (
            <Avatar
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                bgcolor: 'primary.main',
              }}
            >
              <AvatarIcon />
            </Avatar>
          )}
        </Box>
      </Box>

      {withDivider && <Divider sx={{ borderColor: 'divider' }} />}
    </Box>
  );
};

export default HeaderContainer;
