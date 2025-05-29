import React, { useState, useEffect } from 'react';
import { Box, Drawer, Divider, Typography, Autocomplete, TextField as MuiTextField } from '@mui/material';
import { DrawerHeader } from '../shared/components/ui/DrawerHeader';
import { TextField } from '../shared/components/ui/TextField';
import { Select } from '../shared/components/ui/Select';
import { SegmentedButton } from '../shared/components/ui/SegmentedButton';
import { PrimaryButton } from '../shared/components/ui/PrimaryButton';
import { SettingsGroup } from '../shared/components/ui/SettingsGroup';
import { CheckboxWithLabel } from '../shared/components/ui/CheckboxWithLabel';
import containerService from '../services/containerService';
import tenantService from '../services/tenantService';
import seedTypeService from '../services/seedTypeService';
import type { ContainerFormData } from '../shared/types/containers';
import type { Tenant } from '../shared/types/tenants';
import type { SeedType } from '../shared/types/seedTypes';

interface CreateContainerPageProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ContainerFormData) => void;
}

interface FormErrors {
  name?: string;
  tenant?: string;
  purpose?: string;
  seed_types?: string;
  location?: string;
}

const CreateContainerPage: React.FC<CreateContainerPageProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  // Form state
  const [formData, setFormData] = useState<ContainerFormData>({
    name: '',
    tenant: '',
    type: 'physical',
    purpose: '',
    seed_types: [],
    location: '',
    notes: '',
    shadow_service_enabled: false,
    connect_to_other_systems: false
  });

  // Supporting data
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [seedTypes, setSeedTypes] = useState<SeedType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      setIsLoading(true);
      try {
        console.log('Loading reference data...');
        const [tenantsData, seedTypesData] = await Promise.all([
          tenantService.getTenants(),
          seedTypeService.getSeedTypes()
        ]);
        console.log('Raw tenants data:', tenantsData);
        console.log('Raw seed types data:', seedTypesData);
        setTenants(tenantsData.results || tenantsData);
        setSeedTypes(seedTypesData);
        console.log('Loaded tenants:', tenantsData.results || tenantsData);
        console.log('Loaded seed types:', seedTypesData);
      } catch (error) {
        console.error('Failed to load reference data:', error);
        // Add fallback data for testing
        setTenants([
          { id: 'tenant-001', name: 'Skybridge Farms' },
          { id: 'tenant-002', name: 'EcoGrow Solutions' },
          { id: 'tenant-003', name: 'UrbanLeaf Inc.' }
        ]);
        setSeedTypes([
          { id: 'seed-001', name: 'Tomatoes' },
          { id: 'seed-002', name: 'Lettuce' },
          { id: 'seed-003', name: 'Carrots' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      loadReferenceData();
    }
  }, [open]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Container name is required';
    }

    if (!formData.tenant) {
      newErrors.tenant = 'Tenant selection is required';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Purpose selection is required';
    }

    if (formData.seed_types.length === 0) {
      newErrors.seed_types = 'At least one seed type must be selected';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form handlers
  const handleInputChange = (field: keyof ContainerFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSeedTypeChange = (selectedSeedTypes: SeedType[]) => {
    setFormData(prev => ({
      ...prev,
      seed_types: selectedSeedTypes.map(seedType => seedType.id)
    }));
    // Clear error when user makes a selection
    if (errors.seed_types) {
      setErrors(prev => ({ ...prev, seed_types: undefined }));
    }
  };

  const handleSubmit = async () => {
    console.log('Form submission started');
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform form data to match backend API requirements
      const transformedData = {
        name: formData.name,
        tenant: formData.tenant,
        type: formData.type.toUpperCase() as 'PHYSICAL' | 'VIRTUAL', // Convert to uppercase
        purpose: formData.purpose.charAt(0).toUpperCase() + formData.purpose.slice(1), // Capitalize first letter
        seed_types: formData.seed_types,
        location: {
          city: formData.location,
          country: 'Ukraine', // Default country, could be made configurable
          address: '' // Default empty address as it's required by backend
        },
        notes: formData.notes || '',
        shadow_service_enabled: formData.shadow_service_enabled,
        status: 'CREATED', // Default status for new containers
        creator: 'current-user', // This should come from auth context in real app
        system_integrations: {
          fa_integration: { name: 'FA Integration', enabled: false },
          aws_environment: { name: 'AWS Environment', enabled: false },
          mbai_environment: { name: 'MBAI Environment', enabled: formData.connect_to_other_systems }
        }
      };
      
      console.log('Transformed form data:', transformedData);
      const result = await containerService.createContainerFromForm(transformedData as any);
      onSubmit?.(formData);
      console.log('Container created successfully:', result);
      onClose();
    } catch (error) {
      console.error('Failed to create container:', error);
      alert('Failed to create container: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Options for dropdowns
  const tenantOptions = tenants?.map(tenant => ({
    value: tenant.id,
    label: tenant.name
  })) || [];
  
  console.log('Tenants state:', tenants);
  console.log('Tenant options:', tenantOptions);

  const purposeOptions = [
    { value: 'development', label: 'Development' },
    { value: 'research', label: 'Research' },
    { value: 'production', label: 'Production' }
  ];

  const containerTypeOptions = [
    { value: 'physical', label: 'Physical' },
    { value: 'virtual', label: 'Virtual' }
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: {
            xs: '100vw', // Mobile: full screen
            sm: '80vw',  // Tablet: 80% of screen
            md: 600,     // Desktop: fixed 400px (increased from 372px for better UX)
          },
          maxWidth: {
            xs: 'none',
            sm: 800,     // Tablet max width
            md: 600,     // Desktop fixed width
          },
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 2 }, // Responsive padding
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <DrawerHeader title="Create New Container" onClose={onClose} />
        
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          mt: { xs: 1.5, sm: 2, md: 2 } // Responsive top margin
        }}>
          {/* Container Information Section */}
          <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                lineHeight: '20px',
                color: '#000000',
                mb: 2
              }}
            >
              Container Information
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 1.5, sm: 2, md: 2 } // Responsive gap between form fields
            }}>
              <TextField
                label="Container Name"
                placeholder="farm-container-04"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
              
              <Select
                label="Tenant"
                options={tenantOptions}
                value={formData.tenant}
                onChange={(e) => handleInputChange('tenant', e.target.value as string)}
                error={!!errors.tenant}
                helperText={errors.tenant || (isLoading ? 'Loading tenants...' : '')}
                disabled={isLoading}
              />
              
              {/* Container Type Toggle */}
              <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: 13, sm: 14, md: 14 }, // Responsive font size
                    lineHeight: '20px',
                    color: '#000000',
                  }}
                >
                  Container Type
                </Typography>
                <SegmentedButton
                  value={formData.type}
                  options={containerTypeOptions}
                  onChange={(value) => handleInputChange('type', value)}
                />
              </Box>
              
              <Select
                label="Purpose"
                options={purposeOptions}
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value as string)}
                error={!!errors.purpose}
                helperText={errors.purpose}
              />
              
              {/* Seed Type Variant(s) */}
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: 13, sm: 14, md: 14 }, // Responsive font size
                    lineHeight: '20px',
                    color: '#000000',
                    mb: { xs: 0.5, sm: 1, md: 1 } // Responsive margin bottom
                  }}
                >
                  Seed Type Variant(s)
                </Typography>
                <Autocomplete
                  multiple
                  options={seedTypes || []}
                  getOptionLabel={(option) => option.name}
                  value={seedTypes?.filter(seedType => formData.seed_types.includes(seedType.id)) || []}
                  onChange={(_, newValue) => handleSeedTypeChange(newValue)}
                  renderTags={(value) =>
                    value.map((option) => (
                        <Box
                          key={option.id}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            border: '1px solid #5D4BD4',
                            borderRadius: '20px',
                            padding: '2px 7px',
                            margin: '2px 4px 2px 0',
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: '14px',
                            color: '#5D4BD4',
                            cursor: 'default',
                          }}
                        >
                          <span>{option.name}</span>
                          <Box
                            onClick={() => {
                              const newSeedTypes = formData.seed_types.filter(id => id !== option.id);
                              setFormData(prev => ({ ...prev, seed_types: newSeedTypes }));
                            }}
                            sx={{
                              marginLeft: '8px',
                              width: '16px',
                              height: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              borderRadius: '2px',
                              '&:hover': {
                                backgroundColor: 'rgba(93, 75, 212, 0.1)',
                              },
                            }}
                          >
                            <Typography sx={{ color: '#5D4BD4', fontSize: '14px', lineHeight: 1, fontWeight: 'bold' }}>
                              ×
                            </Typography>
                          </Box>
                        </Box>
                    ))
                  }
                  renderInput={(params) => (
                    <MuiTextField
                      {...params}
                      placeholder={formData.seed_types.length === 0 ? "Seed Type Variant(s)" : ""}
                      error={!!errors.seed_types}
                      helperText={errors.seed_types}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#FFFFFF',
                          borderRadius: '6px',
                          padding: '12px',
                          minHeight: 'auto',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          '& fieldset': {
                            borderColor: errors.seed_types ? '#d32f2f' : 'rgba(0, 0, 0, 0.22)',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: errors.seed_types ? '#d32f2f' : 'rgba(0, 0, 0, 0.38)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.seed_types ? '#d32f2f' : '#2196f3',
                          },
                          '& .MuiAutocomplete-input': {
                            flex: 1,
                            minWidth: '100px',
                            padding: '0 !important',
                          },
                        },
                        '& .MuiInputBase-input': {
                          fontFamily: 'Inter, Roboto, sans-serif',
                          fontSize: '16px',
                          lineHeight: '24px',
                          color: 'rgba(0, 0, 0, 0.87)',
                          padding: '0 !important',
                        },
                        '& .MuiAutocomplete-endAdornment': {
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        },
                        '& .MuiAutocomplete-popupIndicator': {
                          color: 'rgba(0, 0, 0, 0.54)',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        },
                      }}
                    />
                  )}
                  popupIcon={undefined}
                  sx={{
                    '& .MuiAutocomplete-inputRoot': {
                      paddingRight: '32px !important', // Make room for dropdown arrow
                    },
                  }}
                />
              </Box>
              
              <TextField
                label="Location"
                placeholder="Lviv"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
              />
              
              <TextField
                sx={{
                  fontSize: '12'
                }}
                placeholder="Notes (optional)"
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </Box>
          </Box>

          <Divider sx={{ my: { xs: 1.5, sm: 2, md: 2 } }} />

          {/* Settings Section */}
          <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
            <SettingsGroup
              title="Settings"
              options={[
                {
                  label: 'Enable Shadow Service',
                  checked: formData.shadow_service_enabled,
                  onChange: (_, checked) => handleInputChange('shadow_service_enabled', checked)
                }
              ]}
            />
          </Box>

          <Divider sx={{ my: { xs: 1.5, sm: 2, md: 2 } }} />

          {/* System Integration Section */}
          <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                lineHeight: '20px',
                color: '#000000',
                mb: 2
              }}
            >
              System Integration
            </Typography>
            
            <CheckboxWithLabel
              label="Connect to other systems after creation"
              checked={formData.connect_to_other_systems}
              onChange={(_, checked) => handleInputChange('connect_to_other_systems', checked)}
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          mt: 'auto', 
          pt: { xs: 1.5, sm: 2, md: 2 }, // Responsive padding top
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 1.5, sm: 2, md: 2 } // Responsive gap between buttons
        }}>
          <PrimaryButton 
            fullWidth 
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{ 
              height: { xs: 44, sm: 48, md: 48 } // Responsive button height for touch targets
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Container'}
          </PrimaryButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateContainerPage;