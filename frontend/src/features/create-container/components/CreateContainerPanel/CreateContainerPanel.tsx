import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ContainerFormData, ValidationError } from '../../models/create-container.model';
import { SeedType, Tenant, Location } from '../../../../types/containers';
import { ContainerInformationSection } from './components/ContainerInformationSection';
import { SettingsSection } from './components/SettingsSection';
import { SystemIntegrationSection } from './components/SystemIntegrationSection';
import { CreateContainerFooter } from './components/CreateContainerFooter';
import {
  PanelWrapper,
  PanelHeader,
  PanelContent,
  ScrollableContent,
  SectionSpacer
} from './CreateContainerPanel.styles';

export interface CreateContainerPanelProps {
  formData: ContainerFormData;
  validationErrors: ValidationError[];
  availableTenants: Tenant[];
  availableSeedTypes: SeedType[];
  availableContainers: Array<{ id: number; name: string }>;
  showLocationFields: boolean;
  showVirtualSettings: boolean;
  showEcosystemSettings: boolean;
  submitButtonLabel: string;
  submitButtonDisabled: boolean;
  isSubmitting: boolean;
  selectedSeedTypesDisplay: string;
  locationDisplay: string;
  onFieldUpdate: <K extends keyof ContainerFormData>(field: K, value: ContainerFormData[K]) => void;
  onLocationUpdate: (location: Partial<Location>) => void;
  onContainerTypeToggle: (type: 'physical' | 'virtual') => void;
  onEcosystemToggle: (connected: boolean) => void;
  onSeedTypeAdd: (seedTypeId: number) => void;
  onSeedTypeRemove: (seedTypeId: number) => void;
  onValidate: () => void;
  onReset: () => void;
  onSubmit: () => void;
  onClose: () => void;
  getFieldErrors: (field: string) => ValidationError[];
  hasFieldErrors: (field: string) => boolean;
  getSelectedSeedTypes: () => SeedType[];
  getTenantName: (tenantId: number | null) => string;
  getContainerName: (containerId: number | null) => string;
}

export const CreateContainerPanel: React.FC<CreateContainerPanelProps> = ({
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
  isSubmitting,
  selectedSeedTypesDisplay,
  locationDisplay,
  onFieldUpdate,
  onLocationUpdate,
  onContainerTypeToggle,
  onEcosystemToggle,
  onSeedTypeAdd,
  onSeedTypeRemove,
  onValidate,
  onReset,
  onSubmit,
  onClose,
  getFieldErrors,
  hasFieldErrors,
  getSelectedSeedTypes,
  getTenantName,
  getContainerName
}) => {
  return (
    <PanelWrapper>
      <PanelHeader>
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: 'Roboto, sans-serif',
            fontSize: '22px',
            fontWeight: 600,
            color: '#000000'
          }}
        >
          Create New Container
        </Typography>
        <IconButton 
          onClick={onClose}
          size="small"
          sx={{ p: 1 }}
        >
          <CloseIcon />
        </IconButton>
      </PanelHeader>

      <PanelContent>
        <ScrollableContent>
          <ContainerInformationSection
            formData={formData}
            availableTenants={availableTenants}
            availableSeedTypes={availableSeedTypes}
            showLocationFields={showLocationFields}
            onFieldUpdate={onFieldUpdate}
            onLocationUpdate={onLocationUpdate}
            onContainerTypeToggle={onContainerTypeToggle}
            onSeedTypeAdd={onSeedTypeAdd}
            onSeedTypeRemove={onSeedTypeRemove}
            getFieldErrors={getFieldErrors}
            hasFieldErrors={hasFieldErrors}
            getSelectedSeedTypes={getSelectedSeedTypes}
          />

          <SectionSpacer />

          <SettingsSection
            formData={formData}
            availableContainers={availableContainers}
            showVirtualSettings={showVirtualSettings}
            onFieldUpdate={onFieldUpdate}
            getFieldErrors={getFieldErrors}
            hasFieldErrors={hasFieldErrors}
            getContainerName={getContainerName}
          />

          <SectionSpacer />

          <SystemIntegrationSection
            formData={formData}
            showEcosystemSettings={showEcosystemSettings}
            onEcosystemToggle={onEcosystemToggle}
            onFieldUpdate={onFieldUpdate}
          />
        </ScrollableContent>

        <CreateContainerFooter
          label={submitButtonLabel}
          disabled={submitButtonDisabled}
          loading={isSubmitting}
          onClick={onSubmit}
        />
      </PanelContent>
    </PanelWrapper>
  );
};