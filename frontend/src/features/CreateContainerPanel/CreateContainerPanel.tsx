import React, { useState, useEffect } from 'react';
import { 
  TextInput, 
  Select, 
  SelectOption,
  Switch, 
  Checkbox, 
  SegmentedButton 
} from '../../shared/components/ui';
import { 
  containerService, 
  tenantService, 
  seedTypeService 
} from '../../api';
import { 
  CreateContainerPanelProps, 
  CreateContainerFormData, 
  FormErrors,
  EnvironmentToggleState,
  purposeOptions,
  initialFormData,
  initialEnvironmentState
} from './types';
import { CreateContainerRequest, Container } from '../../shared/types/containers';
import { Tenant, SeedType } from '../../types/verticalFarm';
import {
  Overlay,
  PanelContainer,
  Header,
  Title,
  CloseButton,
  FormContainer,
  FormSection,
  SectionTitle,
  FormField,
  FieldLabel,
  Required,
  HorizontalGroup,
  SwitchRow,
  SwitchLabel,
  CheckboxRow,
  CheckboxLabel,
  EnvironmentPanel,
  EnvironmentRow,
  EnvironmentLabel,
  EnvironmentButtons,
  EnvironmentButton,
  Footer,
  CreateButton,
  ErrorMessage,
  LoadingSpinner
} from './CreateContainerPanel.styles';

/**
 * CreateContainerPanel - A slide-in panel for creating new containers
 * 
 * Features:
 * - Dynamic form fields based on container type (Physical/Virtual)
 * - Integration with backend APIs for tenants, seed types
 * - Form validation with error handling
 * - Environment auto-selection based on purpose
 * - Multi-select for seed types
 */
export const CreateContainerPanel: React.FC<CreateContainerPanelProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [seedTypes, setSeedTypes] = useState<SeedType[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [environmentState, setEnvironmentState] = useState<EnvironmentToggleState>(initialEnvironmentState);
  const [formData, setFormData] = useState<CreateContainerFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  // Load data when panel opens
  useEffect(() => {
    if (open) {
      loadData();
      // Reset form when opening
      setFormData(initialFormData);
      setErrors({});
      setEnvironmentState(initialEnvironmentState);
    }
  }, [open]);

  const loadData = async () => {
    try {
      const [tenantsData, seedTypesData, containersResponse] = await Promise.all([
        tenantService.getTenants(),
        seedTypeService.getSeedTypes(),
        containerService.listContainers()
      ]);
      
      setTenants(tenantsData);
      setSeedTypes(seedTypesData);
      if (containersResponse.data) {
        setContainers(containersResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const containerTypeOptions = [
    { value: 'Physical', label: 'Physical' },
    { value: 'Virtual', label: 'Virtual' }
  ];

  const tenantOptions: SelectOption[] = tenants.map(tenant => ({
    value: tenant.id,
    label: tenant.name
  }));

  const seedTypeOptions: SelectOption[] = seedTypes.map(seedType => ({
    value: seedType.id,
    label: `${seedType.name} ${seedType.variety ? `(${seedType.variety})` : ''}`
  }));

  const containerOptions: SelectOption[] = containers
    .filter(container => container.type === 'physical')
    .map(container => ({
      value: container.id,
      label: container.name
    }));

  const handleFormChange = (field: keyof CreateContainerFormData, value: string | number | boolean | (string | number)[] | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handlePurposeChange = (purpose: string) => {
    handleFormChange('purpose', purpose);
    
    // Auto-select environments based on purpose
    if (purpose === 'development') {
      setEnvironmentState({
        fa: 'Alpha',
        pya: 'Dev',
        aws: 'Dev',
        mbai: 'Prod',
        fh: 'Default'
      });
    } else if (purpose === 'research' || purpose === 'production') {
      setEnvironmentState({
        fa: 'Prod',
        pya: 'Stage',
        aws: 'Prod',
        mbai: 'Prod',
        fh: 'Default'
      });
    }
  };

  const handleEnvironmentToggle = (key: keyof EnvironmentToggleState, value: string) => {
    setEnvironmentState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Container name is required';
    }

    if (!formData.tenant_id) {
      newErrors.tenant_id = 'Tenant is required';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Purpose is required';
    }

    if (!formData.seed_types || formData.seed_types.length === 0) {
      newErrors.seed_types = 'At least one seed type is required';
    }

    if (formData.type === 'Physical' && !formData.location.trim()) {
      newErrors.location = 'Location is required for physical containers';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    
    try {
      // Find the tenant name for the request
      const selectedTenant = tenants.find(t => t.id === Number(formData.tenant_id));
      if (!selectedTenant) {
        throw new Error('Selected tenant not found');
      }

      const createRequest: CreateContainerRequest = {
        name: formData.name,
        tenant: selectedTenant.name,
        type: formData.type.toLowerCase() as 'physical' | 'virtual',
        purpose: formData.purpose.toLowerCase() as 'development' | 'research' | 'production',
        location: formData.location || '',
        seed_types: formData.seed_types.map(id => id.toString()),
        notes: formData.notes || undefined,
        shadow_service_enabled: formData.shadow_service_enabled,
        connect_to_other_systems: formData.ecosystem_connected
      };

      const response = await containerService.createContainer(createRequest);
      
      if (response.error) {
        throw new Error(response.error.detail);
      }

      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating container:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Failed to create container' });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <Overlay open={open} onClick={onClose} />
      <PanelContainer open={open}>
        <Header>
          <Title>Create New Container</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <FormContainer>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
              {/* Container Information Section */}
            <FormSection>
              <SectionTitle>Container Information</SectionTitle>
              
              <FormField>
                <FieldLabel>
                  Container Name<Required>*</Required>
                </FieldLabel>
                <TextInput
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Enter container name"
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormField>

              <FormField>
                <FieldLabel>
                  Tenant<Required>*</Required>
                </FieldLabel>
                <Select
                  options={tenantOptions}
                  value={formData.tenant_id}
                  onChange={(value) => handleFormChange('tenant_id', value)}
                  placeholder="Select tenant"
                />
                {errors.tenant_id && <ErrorMessage>{errors.tenant_id}</ErrorMessage>}
              </FormField>

              <FormField>
                <HorizontalGroup>
                  <FieldLabel>Container Type</FieldLabel>
                  <SegmentedButton
                    options={containerTypeOptions}
                    value={formData.type}
                    onChange={(value) => handleFormChange('type', value)}
                  />
                </HorizontalGroup>
              </FormField>

              <FormField>
                <FieldLabel>
                  Purpose<Required>*</Required>
                </FieldLabel>
                <Select
                  options={purposeOptions}
                  value={formData.purpose}
                  onChange={(value) => handlePurposeChange(value as string)}
                  placeholder="Select purpose"
                />
                {errors.purpose && <ErrorMessage>{errors.purpose}</ErrorMessage>}
              </FormField>

              <FormField>
                <FieldLabel>
                  Seed Type Variant(s)<Required>*</Required>
                </FieldLabel>
                <Select
                  options={seedTypeOptions}
                  value={formData.seed_types}
                  onChange={(value) => handleFormChange('seed_types', value)}
                  placeholder="Select seed types"
                  multiple
                />
                {errors.seed_types && <ErrorMessage>{errors.seed_types}</ErrorMessage>}
              </FormField>

              {formData.type === 'Physical' && (
                <FormField>
                  <FieldLabel>
                    Location<Required>*</Required>
                  </FieldLabel>
                  <TextInput
                    value={formData.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                    placeholder="Enter location"
                  />
                  {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
                </FormField>
              )}

              <FormField>
                <FieldLabel>Notes (optional)</FieldLabel>
                <TextInput
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  placeholder="Enter notes"
                />
              </FormField>
            </FormSection>

            {/* Settings Section */}
            <FormSection>
              <SectionTitle>Settings</SectionTitle>
              
              <SwitchRow>
                <SwitchLabel>Enable Shadow Service</SwitchLabel>
                <Switch
                  checked={formData.shadow_service_enabled}
                  onChange={(checked) => handleFormChange('shadow_service_enabled', checked)}
                />
              </SwitchRow>

              {formData.type === 'Virtual' && (
                <>
                  <FormField>
                    <FieldLabel>Copy Environment from Container</FieldLabel>
                    <Select
                      options={containerOptions}
                      value={formData.copied_environment_from}
                      onChange={(value) => handleFormChange('copied_environment_from', value)}
                      placeholder="Select container"
                    />
                  </FormField>

                  <SwitchRow>
                    <SwitchLabel>Run Robotics Simulation</SwitchLabel>
                    <Switch
                      checked={formData.robotics_simulation_enabled}
                      onChange={(checked) => handleFormChange('robotics_simulation_enabled', checked)}
                    />
                  </SwitchRow>
                </>
              )}
            </FormSection>

            {/* System Integration Section */}
            <FormSection>
              <SectionTitle>System Integration</SectionTitle>
              
              <CheckboxRow>
                <Checkbox
                  checked={formData.ecosystem_connected}
                  onChange={(e) => handleFormChange('ecosystem_connected', e.target.checked)}
                />
                <CheckboxLabel>Connect to other systems after creation</CheckboxLabel>
              </CheckboxRow>

              {formData.ecosystem_connected && (
                <EnvironmentPanel>
                  <EnvironmentRow>
                    <EnvironmentLabel>FA Environment</EnvironmentLabel>
                    <EnvironmentButtons>
                      <EnvironmentButton
                        type="button"
                        active={environmentState.fa === 'Alpha'}
                        onClick={() => handleEnvironmentToggle('fa', 'Alpha')}
                      >
                        Alpha
                      </EnvironmentButton>
                      <EnvironmentButton
                        type="button"
                        active={environmentState.fa === 'Prod'}
                        onClick={() => handleEnvironmentToggle('fa', 'Prod')}
                      >
                        Prod
                      </EnvironmentButton>
                    </EnvironmentButtons>
                  </EnvironmentRow>

                  <EnvironmentRow>
                    <EnvironmentLabel>PYA Environment</EnvironmentLabel>
                    <EnvironmentButtons>
                      <EnvironmentButton
                        type="button"
                        active={environmentState.pya === 'Dev'}
                        onClick={() => handleEnvironmentToggle('pya', 'Dev')}
                      >
                        Dev
                      </EnvironmentButton>
                      <EnvironmentButton
                        type="button"
                        active={environmentState.pya === 'Test'}
                        onClick={() => handleEnvironmentToggle('pya', 'Test')}
                      >
                        Test
                      </EnvironmentButton>
                      <EnvironmentButton
                        type="button"
                        active={environmentState.pya === 'Stage'}
                        onClick={() => handleEnvironmentToggle('pya', 'Stage')}
                      >
                        Stage
                      </EnvironmentButton>
                    </EnvironmentButtons>
                  </EnvironmentRow>

                  <EnvironmentRow>
                    <EnvironmentLabel>AWS Environment</EnvironmentLabel>
                    <EnvironmentButtons>
                      <EnvironmentButton
                        type="button"
                        active={environmentState.aws === 'Dev'}
                        onClick={() => handleEnvironmentToggle('aws', 'Dev')}
                      >
                        Dev
                      </EnvironmentButton>
                      <EnvironmentButton
                        type="button"
                        active={environmentState.aws === 'Prod'}
                        onClick={() => handleEnvironmentToggle('aws', 'Prod')}
                      >
                        Prod
                      </EnvironmentButton>
                    </EnvironmentButtons>
                  </EnvironmentRow>

                  <EnvironmentRow>
                    <EnvironmentLabel>MBAI Environment</EnvironmentLabel>
                    <EnvironmentButtons>
                      <EnvironmentButton
                        type="button"
                        active={true}
                        disabled={true}
                      >
                        Prod only
                      </EnvironmentButton>
                    </EnvironmentButtons>
                  </EnvironmentRow>
                </EnvironmentPanel>
              )}
            </FormSection>
            </div>

            <Footer>
              {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
              <CreateButton type="submit" loading={loading} disabled={loading}>
                {loading && <LoadingSpinner />}
                {formData.ecosystem_connected ? 'Create and Connect' : 'Create Container'}
              </CreateButton>
            </Footer>
          </form>
        </FormContainer>
      </PanelContainer>
    </>
  );
};

export default CreateContainerPanel;