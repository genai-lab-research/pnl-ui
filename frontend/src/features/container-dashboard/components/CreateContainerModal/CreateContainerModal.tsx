import React from 'react';
import { Drawer } from '@mui/material';
import { useCreateContainer } from '../../../create-container/hooks/useCreateContainer';
import { CreateContainerPanel } from '../../../create-container/components/CreateContainerPanel';

interface CreateContainerModalProps {
  open: boolean;
  onClose: () => void;
  onContainerCreated?: () => void;
}

export const CreateContainerModal: React.FC<CreateContainerModalProps> = ({
  open,
  onClose,
  onContainerCreated
}) => {
  const {
    isLoading,
    isSubmitting,
    formData,
    validationErrors,
    availableTenants,
    availableSeedTypes,
    availableContainers,
    showLocationFields,
    showVirtualSettings,
    showEcosystemSettings,
    submitButtonLabel,
    submitButtonDisabled,
    selectedSeedTypesDisplay,
    locationDisplay,
    updateField,
    updateLocation,
    toggleContainerType,
    toggleEcosystemConnection,
    addSeedType,
    removeSeedType,
    validateForm,
    resetForm,
    submitForm,
    getFieldErrors,
    hasFieldErrors,
    getSelectedSeedTypes,
    getTenantName,
    getContainerName
  } = useCreateContainer();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    validateForm();
    
    if (!submitButtonDisabled) {
      try {
        const result = await submitForm();
        if (result.success) {
          resetForm();
          onClose();
          onContainerCreated?.();
        }
      } catch (error) {
        console.error('Failed to create container:', error);
      }
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      variant="temporary"
      ModalProps={{
        keepMounted: false,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: 420,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
          zIndex: 1300
        },
      }}
    >
      <CreateContainerPanel
        formData={formData}
        validationErrors={validationErrors}
        availableTenants={availableTenants}
        availableSeedTypes={availableSeedTypes}
        availableContainers={availableContainers}
        showLocationFields={showLocationFields}
        showVirtualSettings={showVirtualSettings}
        showEcosystemSettings={showEcosystemSettings}
        submitButtonLabel={submitButtonLabel}
        submitButtonDisabled={submitButtonDisabled}
        isSubmitting={isSubmitting}
        selectedSeedTypesDisplay={selectedSeedTypesDisplay}
        locationDisplay={locationDisplay}
        onFieldUpdate={updateField}
        onLocationUpdate={updateLocation}
        onContainerTypeToggle={toggleContainerType}
        onEcosystemToggle={toggleEcosystemConnection}
        onSeedTypeAdd={addSeedType}
        onSeedTypeRemove={removeSeedType}
        onValidate={validateForm}
        onReset={resetForm}
        onSubmit={handleSubmit}
        onClose={handleClose}
        getFieldErrors={getFieldErrors}
        hasFieldErrors={hasFieldErrors}
        getSelectedSeedTypes={getSelectedSeedTypes}
        getTenantName={getTenantName}
        getContainerName={getContainerName}
      />
    </Drawer>
  );
};