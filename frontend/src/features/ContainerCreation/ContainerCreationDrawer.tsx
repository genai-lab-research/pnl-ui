import React, { useState } from 'react';
import { Drawer, Typography, Box, Button, Divider } from '@mui/material';
import { TextInput } from '../../shared/components/ui/TextInput';
import { Switch } from '../../shared/components/ui/Switch';
import { Checkbox } from '../../shared/components/ui/Checkbox';
import { PurposeSelect } from '../../shared/components/ui/PurposeSelect';
import { SegmentedButton } from '../../shared/components/ui/SegmentedButton';
import { containerService } from '../../api/containerService';
import { ContainerCreationDrawerProps, ContainerFormData, ContainerFormErrors } from './types';

/**
 * Container Creation Drawer Component
 * A slide-in drawer for creating new containers with form validation and API integration
 */
export const ContainerCreationDrawer: React.FC<ContainerCreationDrawerProps> = ({
  open,
  onClose,
  onContainerCreated
}) => {
  const [formData, setFormData] = useState<ContainerFormData>({
    name: '',
    tenant: '',
    type: 'physical',
    purpose: 'development',
    location: '',
    seed_types: [],
    notes: '',
    shadow_service_enabled: false,
    connect_to_other_systems: false
  });

  const [errors, setErrors] = useState<ContainerFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerTypeOptions = [
    { label: 'Physical', value: 'physical' as const },
    { label: 'Virtual', value: 'virtual' as const }
  ];


  const validateForm = (): boolean => {
    const newErrors: ContainerFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Container name is required';
    }

    if (!formData.tenant.trim()) {
      newErrors.tenant = 'Tenant is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContainerFormData) => (
    value: string | boolean | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof ContainerFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSeedTypesChange = (value: string) => {
    const seedTypes = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    handleInputChange('seed_types')(seedTypes);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await containerService.createContainer(formData);
      
      if (response.error) {
        console.error('Failed to create container:', response.error);
        // Handle API errors
        return;
      }

      if (onContainerCreated) {
        onContainerCreated(formData);
      }

      // Reset form and close drawer
      setFormData({
        name: '',
        tenant: '',
        type: 'physical',
        purpose: 'development',
        location: '',
        seed_types: [],
        notes: '',
        shadow_service_enabled: false,
        connect_to_other_systems: false
      });
      onClose();
    } catch (error) {
      console.error('Error creating container:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          padding: 3,
          backgroundColor: '#FFFFFF'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
        {/* Header */}
        <Typography variant="h6" component="h2">
          Create Container
        </Typography>
        
        <Divider />

        {/* Form Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1 }}>
          {/* Container Name */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Container Name
            </Typography>
            <TextInput
              placeholder="Enter container name"
              value={formData.name}
              onChange={(e) => handleInputChange('name')(e.target.value)}
            />
          </Box>

          {/* Tenant */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Tenant
            </Typography>
            <TextInput
              placeholder="Enter tenant"
              value={formData.tenant}
              onChange={(e) => handleInputChange('tenant')(e.target.value)}
            />
          </Box>

          {/* Container Type */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Type
            </Typography>
            <SegmentedButton
              options={containerTypeOptions}
              value={formData.type}
              onChange={(value: string) => handleInputChange('type')(value)}
            />
          </Box>

          {/* Purpose */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Purpose
            </Typography>
            <PurposeSelect
              value={formData.purpose}
              onChange={(value: string) => handleInputChange('purpose')(value)}
              placeholder="Select purpose"
            />
          </Box>

          {/* Location */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Location
            </Typography>
            <TextInput
              placeholder="Enter location"
              value={formData.location}
              onChange={(e) => handleInputChange('location')(e.target.value)}
            />
          </Box>

          {/* Seed Types */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Seed Types
            </Typography>
            <TextInput
              placeholder="Enter seed types (comma separated)"
              value={formData.seed_types?.join(', ') || ''}
              onChange={(e) => handleSeedTypesChange(e.target.value)}
            />
          </Box>

          {/* Notes */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Notes
            </Typography>
            <TextInput
              placeholder="Notes (optional)"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes')(e.target.value)}
            />
          </Box>

          {/* Shadow Service */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Enable shadow service
            </Typography>
            <Switch
              checked={formData.shadow_service_enabled}
              onChange={(checked) => handleInputChange('shadow_service_enabled')(checked)}
            />
          </Box>

          {/* Connect to Other Systems */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox
              checked={formData.connect_to_other_systems}
              onChange={(e) => handleInputChange('connect_to_other_systems')(e.target.checked)}
            />
            <Typography variant="body2">
              Connect to other systems after creation
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              height: 40,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Container'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};