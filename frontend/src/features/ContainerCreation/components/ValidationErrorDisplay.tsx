import React from 'react';
import { Alert, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { ContainerFormErrors } from '../types';

interface ValidationErrorDisplayProps {
  errors: ContainerFormErrors;
}

export const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({ errors }) => {
  const errorEntries = Object.entries(errors).filter(([_, error]) => !!error);
  
  if (errorEntries.length === 0) {
    return null;
  }

  const hasGeneralError = !!errors.general;
  const fieldErrors = errorEntries.filter(([key]) => key !== 'general');

  const getFieldDisplayName = (fieldName: string): string => {
    const fieldNames: Record<string, string> = {
      name: 'Container Name',
      tenant_id: 'Tenant',
      purpose: 'Purpose', 
      seed_type_ids: 'Seed Types',
      location: 'Location',
    };
    return fieldNames[fieldName] || fieldName;
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* General Error */}
      {hasGeneralError && (
        <Alert 
          severity="error" 
          sx={{ mb: fieldErrors.length > 0 ? 2 : 0 }}
        >
          {errors.general}
        </Alert>
      )}

      {/* Field Errors */}
      {fieldErrors.length > 0 && (
        <Alert severity="warning">
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Please correct the following errors:
          </Typography>
          <List dense sx={{ pt: 0 }}>
            {fieldErrors.map(([fieldName, error]) => (
              <ListItem key={fieldName} sx={{ py: 0, pl: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      <strong>{getFieldDisplayName(fieldName)}:</strong> {error}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Box>
  );
};
