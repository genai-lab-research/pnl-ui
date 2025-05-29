import React, { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

import CreateContainerModal from '../../../../features/container-management/modals/CreateContainerModal';

export interface CreateContainerButtonProps {
  /**
   * Optional click handler
   */
  onClick?: () => void;

  /**
   * Optional custom class name
   */
  className?: string;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional callback triggered when a container is successfully created
   */
  onContainerCreated?: () => void;
}

/**
 * CreateContainerButton component for adding new containers
 * Includes an integrated modal for container creation
 */
export const CreateContainerButton: React.FC<CreateContainerButtonProps> = ({
  onClick,
  className,
  disabled = false,
  onContainerCreated,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleSuccess = () => {
    if (onContainerCreated) {
      onContainerCreated();
    }
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClick}
        className={className}
        disabled={disabled}
        sx={{
          borderRadius: '6px',
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        Create Container
      </Button>
      <CreateContainerModal open={modalOpen} onClose={handleClose} onSuccess={handleSuccess} />
    </>
  );
};

export default CreateContainerButton;
