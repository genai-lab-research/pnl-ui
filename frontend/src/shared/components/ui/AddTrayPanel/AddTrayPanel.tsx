import React, { useState } from 'react';
import {
  Drawer,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  styled,
} from '@mui/material';
import { DrawerHeader } from '../DrawerHeader';

export interface AddTrayPanelProps {
  /**
   * Whether the drawer is open
   */
  open: boolean;
  
  /**
   * Type of item being provisioned
   */
  type: 'tray' | 'panel';
  
  /**
   * Location information to display
   */
  location: string;
  
  /**
   * Callback when drawer is closed
   */
  onClose: () => void;
  
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: TrayPanelFormData) => void;
  
  /**
   * Whether the form is submitting
   */
  loading?: boolean;
}

export interface TrayPanelFormData {
  rfid_tag: string;
  notes?: string;
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 400,
    padding: '24px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: '24px',
}));

const LocationDisplay = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '24px',
  border: '1px solid #e0e0e0',
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  marginTop: '32px',
}));

/**
 * AddTrayPanel component provides a slide-in drawer for provisioning
 * new trays or panels with RFID tag assignment and location display.
 * 
 * @component
 * @example
 * ```tsx
 * <AddTrayPanel
 *   open={isOpen}
 *   type="tray"
 *   location="Shelf Top, Slot 5"
 *   onClose={() => setIsOpen(false)}
 *   onSubmit={(data) => handleSubmit(data)}
 * />
 * ```
 */
export const AddTrayPanel: React.FC<AddTrayPanelProps> = ({
  open,
  type,
  location,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<TrayPanelFormData>({
    rfid_tag: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TrayPanelFormData, string>>>({});

  const title = type === 'tray' ? 'Provision New Tray' : 'Provision New Panel';

  const handleInputChange = (field: keyof TrayPanelFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TrayPanelFormData, string>> = {};

    if (!formData.rfid_tag.trim()) {
      newErrors.rfid_tag = 'RFID tag is required';
    } else if (formData.rfid_tag.length < 6) {
      newErrors.rfid_tag = 'RFID tag must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      // Reset form after successful submission
      setFormData({ rfid_tag: '', notes: '' });
      setErrors({});
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({ rfid_tag: '', notes: '' });
    setErrors({});
    onClose();
  };

  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={handleClose}
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
    >
      <DrawerHeader
        title={title}
        onClose={handleClose}
      />

      {/* Location Display */}
      <LocationDisplay>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Location
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={location}
            size="small"
            sx={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 500,
            }}
          />
        </Box>
      </LocationDisplay>

      {/* RFID Tag Field */}
      <FormSection>
        <TextField
          fullWidth
          label="RFID Tag"
          placeholder="Enter RFID tag identifier"
          value={formData.rfid_tag}
          onChange={handleInputChange('rfid_tag')}
          error={!!errors.rfid_tag}
          helperText={errors.rfid_tag || `Assign an RFID tag to the new ${type}`}
          disabled={loading}
          sx={{ mb: 2 }}
        />
      </FormSection>

      {/* Notes Field */}
      <FormSection>
        <TextField
          fullWidth
          label="Notes (Optional)"
          placeholder={`Add any notes about this ${type}...`}
          value={formData.notes}
          onChange={handleInputChange('notes')}
          multiline
          rows={3}
          disabled={loading}
          sx={{ mb: 2 }}
        />
      </FormSection>

      {/* System Generated ID Info */}
      <Box sx={{ 
        backgroundColor: '#f8f9fa', 
        padding: '12px', 
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        mb: 3
      }}>
        <Typography variant="body2" color="text.secondary">
          <strong>System ID:</strong> A unique identifier will be automatically generated for this {type} upon creation.
        </Typography>
      </Box>

      {/* Action Buttons */}
      <ButtonContainer>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ 
            flex: 1,
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          {loading ? 'Provisioning...' : `Provision ${type === 'tray' ? 'Tray' : 'Panel'}`}
        </Button>
      </ButtonContainer>
    </StyledDrawer>
  );
};

export default AddTrayPanel;