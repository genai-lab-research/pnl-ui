import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { ContainerFormData, ContainerFormOptions, ContainerFormErrors } from '../types';
import { ContainerInformationForm } from './ContainerInformationForm';
import { ContainerSettingsPanel } from './ContainerSettingsPanel';
import { SystemIntegrationPanel } from './SystemIntegrationPanel';
import { ValidationErrorDisplay } from './ValidationErrorDisplay';

interface ContainerCreationDialogProps {
  formData: ContainerFormData;
  errors: ContainerFormErrors;
  options: ContainerFormOptions;
  loading?: boolean;
  onSubmit: (formData: ContainerFormData) => Promise<void>;
  onReset: () => void;
}

const steps = [
  'Container Information',
  'Container Settings', 
  'System Integration'
];

export const ContainerCreationDialog: React.FC<ContainerCreationDialogProps> = ({
  formData,
  errors,
  options,
  loading = false,
  onSubmit,
  onReset
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [localFormData, setLocalFormData] = useState<ContainerFormData>(formData);

  const updateFormData = useCallback((updates: Partial<ContainerFormData>) => {
    setLocalFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(() => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  }, [activeStep]);

  const handleBack = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  }, [activeStep]);

  const handleSubmit = useCallback(async () => {
    try {
      await onSubmit(localFormData);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  }, [localFormData, onSubmit]);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ContainerInformationForm
            formData={localFormData}
            errors={errors}
            options={options}
            onChange={updateFormData}
          />
        );
      case 1:
        return (
          <ContainerSettingsPanel
            formData={localFormData}
            errors={errors}
            options={options}
            onChange={updateFormData}
          />
        );
      case 2:
        return (
          <SystemIntegrationPanel
            formData={localFormData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = activeStep === steps.length - 1;
  const hasStepErrors = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(errors.name || errors.tenant_id || errors.purpose || errors.seed_type_ids || errors.location);
      case 1:
        return false; // Settings are optional
      case 2:
        return false; // Integration is optional
      default:
        return false;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Progress Stepper */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepLabel 
                error={hasStepErrors(index)}
                sx={{
                  '& .MuiStepLabel-labelContainer': {
                    '& .MuiStepLabel-label': {
                      fontSize: '0.875rem',
                      fontWeight: index === activeStep ? 600 : 400,
                    }
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'white', minHeight: '400px' }}>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          sx={{ 
            mb: 3, 
            color: '#1976d2',
            fontWeight: 600 
          }}
        >
          {steps[activeStep]}
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        {getStepContent(activeStep)}
      </Paper>

      {/* Validation Errors */}
      <ValidationErrorDisplay errors={errors} />

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
          >
            Back
          </Button>
          
          {!isLastStep && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
            >
              Next
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onReset}
            disabled={loading}
          >
            Reset
          </Button>
          
          {isLastStep && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ minWidth: '120px' }}
            >
              {localFormData.ecosystem_connected ? 'Create and Connect' : 'Create Container'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
