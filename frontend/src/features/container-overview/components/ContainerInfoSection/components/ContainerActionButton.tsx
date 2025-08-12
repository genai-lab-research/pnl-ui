/** @jsxImportSource @emotion/react */
import React from 'react';
import ActionButton from '../../../../../shared/components/ui/ActionButton/ActionButton';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { containerActionButtonStyles } from './ContainerActionButton.styles';

interface ContainerActionButtonProps {
  action: 'edit' | 'save' | 'cancel';
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Container Overview Action Button - Domain-specific wrapper around atomic ActionButton
 * 
 * This component demonstrates the atomic component pattern:
 * 1. Uses shared ActionButton as the base component
 * 2. Applies container-overview domain styling and behavior
 * 3. Maps container-specific actions to appropriate icons and labels
 * 4. Provides consistent action button styling across container overview
 */
export const ContainerActionButton: React.FC<ContainerActionButtonProps> = ({
  action,
  loading = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  const getActionConfig = (action: string) => {
    switch (action) {
      case 'edit':
        return {
          label: 'Edit',
          icon: <EditIcon fontSize="small" />,
          variant: 'secondary' as const,
          ariaLabel: 'Edit container settings'
        };
      case 'save':
        return {
          label: 'Save Changes',
          icon: <SaveIcon fontSize="small" />,
          variant: 'primary' as const,
          ariaLabel: 'Save container settings changes'
        };
      case 'cancel':
        return {
          label: 'Cancel',
          icon: <CancelIcon fontSize="small" />,
          variant: 'secondary' as const,
          ariaLabel: 'Cancel editing container settings'
        };
      default:
        return {
          label: 'Action',
          icon: null,
          variant: 'primary' as const,
          ariaLabel: 'Container action'
        };
    }
  };

  const config = getActionConfig(action);

  return (
    <div css={containerActionButtonStyles.wrapper} className={className}>
      <ActionButton
        label={config.label}
        icon={config.icon}
        variant={config.variant}
        size="md"
        loading={loading}
        disabled={disabled}
        onClick={onClick}
        ariaLabel={config.ariaLabel}
        className={`container-overview-action-btn container-overview-action-btn--${action}`}
      />
    </div>
  );
};
