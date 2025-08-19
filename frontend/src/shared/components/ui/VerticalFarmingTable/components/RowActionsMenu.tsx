import React, { useState, useEffect, useRef } from 'react';
import {
  IconButton
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  PowerOff as PowerOffIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import Menu from '../../Menu/Menu';
import { MenuItemType } from '../../Menu/types';

export interface RowActionsMenuProps {
  rowId: string;
  onEdit: (rowId: string) => void;
  onShutdown?: (rowId: string) => void;
  onView?: (rowId: string) => void;
  disabled?: boolean;
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
  rowId,
  onEdit,
  onShutdown,
  onView,
  disabled = false
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsMenuVisible(!isMenuVisible);
  };

  const handleClose = () => {
    setIsMenuVisible(false);
  };

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMenuVisible(false);
      }
    };

    if (isMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuVisible]);

  const handleEdit = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    handleClose();
    onEdit(rowId);
  };

  const handleShutdown = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    handleClose();
    if (onShutdown) {
      onShutdown(rowId);
    }
  };

  const handleView = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    handleClose();
    if (onView) {
      onView(rowId);
    }
  };

  const menuItems: MenuItemType[] = [
    ...onView ? [
      {
        id: 'view',
        label: 'View',
        onClick: handleView,
        icon: <VisibilityIcon fontSize="small" sx={{ color: '#4C4E64' }} />
      }
    ] : [],
    {
      id: 'edit',
      label: 'Edit',
      onClick: handleEdit,
      icon: <EditIcon fontSize="small" sx={{ color: '#4C4E64' }} />
    },
    ...onShutdown ? [
      {
        id: 'shutdown',
        label: 'Shutdown',
        onClick: handleShutdown,
        icon: <PowerOffIcon fontSize="small" sx={{ color: '#FF9800' }} />
      }
    ] : []
  ];

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <IconButton
        size="small"
        onClick={handleClick}
        disabled={disabled}
        aria-controls={isMenuVisible ? 'row-actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isMenuVisible ? 'true' : undefined}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <MoreVertIcon />
      </IconButton>
      
      {isMenuVisible && (
        <Menu
          items={menuItems}
          isVisible={isMenuVisible}
          onClose={handleClose}
          position={{ top: 32, right: 0 }}
          aria-label="Row actions menu"
          autoCloseOnSelect={true}
        />
      )}
    </div>
  );
};

export default RowActionsMenu;