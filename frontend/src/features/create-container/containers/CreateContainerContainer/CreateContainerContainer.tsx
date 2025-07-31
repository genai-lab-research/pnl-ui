import React from 'react';
import { Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCreateContainer } from '../../hooks/useCreateContainer';
import { CreateContainerPanel } from '../../components/CreateContainerPanel';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';

export const CreateContainerContainer: React.FC = () => {
  const navigate = useNavigate();
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
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  const handleSubmit = async () => {
    validateForm();
    
    if (!submitButtonDisabled) {
      try {
        const result = await submitForm();
        if (result.success) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Failed to create container:', error);
      }
    }
  };

  return (
    <ErrorBoundary>
      <Drawer
        anchor="right"
        open={true}
        onClose={handleClose}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
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
        {isLoading && <LoadingOverlay />}
        
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
    </ErrorBoundary>
  );
};