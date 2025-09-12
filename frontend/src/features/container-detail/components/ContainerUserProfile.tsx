import React, { useState } from 'react';
import { Avatar, Box, IconButton } from '@mui/material';
import { AccountCircle, Settings, Logout, Person } from '@mui/icons-material';
import { Menu } from '../../../shared/components/ui/Menu';
import type { MenuItemType } from '../../../shared/components/ui/Menu/types';

export interface ContainerUserProfileProps {
  /** User's profile image URL */
  avatarUrl?: string;
  /** User's display name */
  userName?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Optional click handler for profile actions */
  onClick?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * ContainerUserProfile - Domain component for user identification in header
 * 
 * Wraps the Menu atomic component with user avatar and provides dropdown menu
 * functionality for user profile actions. Features circular avatar image,
 * badge support, and dropdown menu integration.
 */
export const ContainerUserProfile: React.FC<ContainerUserProfileProps> = ({
  avatarUrl,
  userName = 'User',
  size = 'medium',
  onClick,
  loading = false,
  className
}) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define menu items for user profile dropdown
  const menuItems: MenuItemType[] = [
    {
      id: 'profile',
      label: 'View Profile',
      icon: <Person />,
      onClick: () => {
        console.log('View profile');
        handleCloseMenu();
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings />,
      onClick: () => {
        console.log('Open settings');
        handleCloseMenu();
      }
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <Logout />,
      onClick: () => {
        console.log('Logout user');
        handleCloseMenu();
      }
    }
  ];

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick();
    } else {
      setMenuAnchor(event.currentTarget);
      setIsMenuOpen(true);
    }
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setMenuAnchor(null);
  };

  // Calculate avatar size based on variant
  const avatarSize = size === 'small' ? 24 : size === 'large' ? 40 : 32;

  return (
    <Box className={className}>
      <IconButton
        onClick={handleAvatarClick}
        disabled={loading}
        size={size}
        aria-label={`${userName} profile menu`}
        sx={{
          padding: 0,
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }}
      >
        <Avatar
          src={avatarUrl}
          alt={userName}
          sx={{
            width: avatarSize,
            height: avatarSize,
            border: '2px solid #e0e0e0',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
            '&:hover': {
              borderColor: '#489F68'
            }
          }}
        >
          {avatarUrl ? null : <AccountCircle />}
        </Avatar>
      </IconButton>

      {/* Profile Menu */}
      <Menu
        items={menuItems}
        isVisible={isMenuOpen}
        position={menuAnchor ? {
          top: (menuAnchor.getBoundingClientRect().bottom + window.scrollY + 8),
          left: (menuAnchor.getBoundingClientRect().left + window.scrollX - 120)
        } : undefined}
        onClose={handleCloseMenu}
        autoCloseOnSelect={true}
        aria-label={`${userName} profile menu`}
      />
    </Box>
  );
};

export default ContainerUserProfile;