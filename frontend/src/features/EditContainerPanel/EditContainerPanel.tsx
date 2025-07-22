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
  containerApiService, 
  tenantService, 
  seedTypeService 
} from '../../api';
import { 
  EditContainerPanelProps, 
  EditContainerFormData, 
  FormErrors,
  EnvironmentToggleState,
  purposeOptions,
  initialEnvironmentState
} from './types';
import { Container } from '../../shared/types/containers';
import { ContainerUpdateRequest, ContainerLocation } from '../../types/container';
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
  SaveButton,
  CancelButton,
  ButtonRow,
  ErrorMessage,
  LoadingSpinner,
  ReadOnlyField
} from './EditContainerPanel.styles';

/**
 * EditContainerPanel - A slide-in panel for editing existing containers
 * 
 * Features:
 * - Pre-populated form fields with container's current data
 * - Container name is read-only (immutable after creation)
 * - Dynamic form fields based on container type (Physical/Virtual)
 * - Ecosystem integration settings with disabled state for already connected containers
 * - Form validation with error handling
 * - Environment auto-selection based on purpose
 */
export const EditContainerPanel: React.FC<EditContainerPanelProps> = ({
  open,
  container,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [seedTypes, setSeedTypes] = useState<SeedType[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [environmentState, setEnvironmentState] = useState<EnvironmentToggleState>(initialEnvironmentState);
  const [formData, setFormData] = useState<EditContainerFormData>({
    name: '',
    tenant_id: '',
    type: 'Physical',
    purpose: '',
    seed_types: [],
    location: '',
    notes: '',
    shadow_service_enabled: false,
    copied_environment_from: '',
    robotics_simulation_enabled: false,
    ecosystem_connected: false
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Load data when panel opens
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  // Populate form when container data changes
  useEffect(() => {
    if (container) {
      populateFormData(container);
    }
  }, [container]);

  const loadData = async () => {
    try {
      const [tenantsData, seedTypesData, containersResponse] = await Promise.all([
        tenantService.getTenants(),
        seedTypeService.getSeedTypes(),
        containerApiService.listContainers()
      ]);
      
      setTenants(tenantsData);
      setSeedTypes(seedTypesData);
      if (containersResponse.containers) {
        // Convert API containers to shared format
        const sharedContainers: Container[] = containersResponse.containers.map(container => ({
          id: container.id.toString(),
          name: container.name,
          tenant: tenants.find(t => t.id === container.tenant_id)?.name || '',
          type: container.type,
          purpose: container.purpose,
          location: {
            city: container.location?.city || '',
            country: container.location?.country || '',
            address: container.location?.address || ''
          },
          // Keep the seed_types as objects with id so we can extract IDs later
          seed_types: container.seed_types || [],
          notes: container.notes || '',
          shadow_service_enabled: container.shadow_service_enabled || false,
          created: container.created_at || '',
          modified: container.updated_at || '',
          has_alert: container.alerts && container.alerts.length > 0,
          status: container.status || 'created',
          ecosystem_connected: container.ecosystem_connected || false
        }));
        setContainers(sharedContainers);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Provide fallback data for Storybook or when APIs are unavailable
      setTenants([
        { id: 1, name: 'tenant-23' },
        { id: 2, name: 'tenant-45' }
      ] as Tenant[]);
      setSeedTypes([
        { id: 1, name: 'Someroots', variety: 'V1', supplier: '', batch_id: '' },
        { id: 2, name: 'sunflower', variety: 'Standard', supplier: '', batch_id: '' }
      ] as SeedType[]);
      setContainers([]);
    }
  };

  const populateFormData = (containerData: Container) => {
    console.log({containerData})
    // Find tenant ID from name
    const tenant = tenants.find(t => t.name === containerData.tenant);
    
    // Extract seed type IDs from the container data
    // The seed_types can be either an array of strings (names) or an array of objects
    const seedTypeIds = containerData.seed_types?.map(st => {
      // If it's a string, try to find the matching seed type by name
      if (typeof st === 'object' && st && 'id' in st) {
        return (st as { id: number }).id.toString();
      }
      return '';
    }).filter(id => id !== '') || [];
    
    setFormData({
      name: containerData.name,
      tenant_id: tenant?.id?.toString() || '',
      type: containerData.type === 'physical' ? 'Physical' : 'Virtual',
      purpose: containerData.purpose,
      seed_types: seedTypeIds,
      location: typeof containerData.location === 'string' ? containerData.location : containerData.location?.address || '',
      notes: containerData.notes || '',
      shadow_service_enabled: containerData.shadow_service_enabled,
      copied_environment_from: '',
      robotics_simulation_enabled: false,
      ecosystem_connected: containerData.ecosystem_connected
    });

    // Set environment state based on purpose
    if (containerData.purpose === 'development') {
      setEnvironmentState({
        fa: 'Alpha',
        pya: 'Dev',
        aws: 'Dev',
        mbai: 'Prod',
        fh: 'Default'
      });
    } else if (containerData.purpose === 'research' || containerData.purpose === 'production') {
      setEnvironmentState({
        fa: 'Prod',
        pya: 'Stage',
        aws: 'Prod',
        mbai: 'Prod',
        fh: 'Default'
      });
    }

    // Clear errors when new container is loaded
    setErrors({});
  };

  const containerTypeOptions = [
    { value: 'Physical', label: 'Physical' },
    { value: 'Virtual', label: 'Virtual' }
  ];

  const tenantOptions: SelectOption[] = tenants.map(tenant => ({
    value: tenant.id.toString(),
    label: tenant.name
  }));

  const seedTypeOptions: SelectOption[] = seedTypes.map(seedType => ({
    value: seedType.id.toString(),
    label: `${seedType.name} ${seedType.variety ? `(${seedType.variety})` : ''}`
  }));

  const containerOptions: SelectOption[] = containers
    .filter(cont => cont.type === 'physical' && cont.id !== container?.id)
    .map(cont => ({
      value: cont.id,
      label: cont.name
    }));

  const handleFormChange = (field: keyof EditContainerFormData, value: string | number | boolean | number[] | string[] | (string | number)[]) => {
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
    
    if (!container) return;

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

      const updateRequest: ContainerUpdateRequest = {
        type: formData.type.toLowerCase() as 'physical' | 'virtual',
        tenant_id: Number(formData.tenant_id),
        purpose: formData.purpose as 'development' | 'research' | 'production',
        location: formData.type === 'Physical' ? { 
          address: formData.location,
          city: '', // These would need to be parsed or collected separately
          country: ''
        } as ContainerLocation : undefined,
        seed_type_ids: formData.seed_types.map(id => typeof id === 'string' ? parseInt(id) : id),
        notes: formData.notes || undefined,
        shadow_service_enabled: formData.shadow_service_enabled,
        copied_environment_from: formData.copied_environment_from ? parseInt(formData.copied_environment_from) : undefined,
        robotics_simulation_enabled: formData.robotics_simulation_enabled,
        ecosystem_connected: formData.ecosystem_connected
      };

      const response = await containerApiService.updateContainer(parseInt(container.id), updateRequest);
      
      if (onSuccess && response) {
        // Convert API response to shared Container format
        const sharedContainer: Container = {
          id: response.id.toString(),
          name: response.name,
          tenant: selectedTenant.name,
          type: response.type,
          purpose: response.purpose,
          location: {
            city: response.location?.city || '',
            country: response.location?.country || '',
            address: response.location?.address || ''
          },
          seed_types: response.seed_types || [],
          notes: response.notes || '',
          shadow_service_enabled: response.shadow_service_enabled || false,
          created: response.created_at || '',
          modified: response.updated_at || '',
          has_alert: response.alerts && response.alerts.length > 0,
          status: response.status || 'created',
          ecosystem_connected: response.ecosystem_connected || false
        };
        onSuccess(sharedContainer);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating container:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Failed to update container' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  if (!open || !container) return null;

  return (
    <>
      <Overlay open={open} onClick={handleCancel} />
      <PanelContainer open={open}>
        <Header>
          <Title>Edit Container</Title>
          <CloseButton onClick={handleCancel}>×</CloseButton>
        </Header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <FormContainer>
            {/* Container Information Section */}
            <FormSection>
              <SectionTitle>Container Information</SectionTitle>
              
              <FormField>
                <FieldLabel>Container Name</FieldLabel>
                <ReadOnlyField>{formData.name}</ReadOnlyField>
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
                  placeholder="Primary production container for Farm A."
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
                      placeholder="Farm_container_03"
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
                  disabled={container?.ecosystem_connected}
                />
                <CheckboxLabel>Connect to other systems after creation</CheckboxLabel>
              </CheckboxRow>

              {formData.ecosystem_connected && (
                <EnvironmentPanel>
                  <EnvironmentRow>
                    <EnvironmentLabel>FA Integration</EnvironmentLabel>
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
                    <EnvironmentLabel>FA Environment</EnvironmentLabel>
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
                        Prod
                      </EnvironmentButton>
                    </EnvironmentButtons>
                  </EnvironmentRow>
                </EnvironmentPanel>
              )}
            </FormSection>
          </FormContainer>

          <Footer>
            {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
            <ButtonRow>
              <CancelButton type="button" onClick={handleCancel}>
                Cancel
              </CancelButton>
              <SaveButton type="submit" loading={loading} disabled={loading}>
                {loading && <LoadingSpinner />}
                Save
              </SaveButton>
            </ButtonRow>
          </Footer>
        </form>
      </PanelContainer>
    </>
  );
};

export default EditContainerPanel;