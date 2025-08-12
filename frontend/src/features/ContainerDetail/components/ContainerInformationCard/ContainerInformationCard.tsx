import React from 'react';
import { Box, Typography, TextField, Chip } from '@mui/material';
import { Factory, Computer, AccessTime, Person, LocationOn } from '@mui/icons-material';
import { BaseInfoCard } from '../BaseInfoCard';
import { ContainerInformationCardProps } from './ContainerInformationCard.types';
import { styles } from './ContainerInformationCard.styles';

export const ContainerInformationCard: React.FC<ContainerInformationCardProps> = ({
  container,
  isEditMode,
  formData,
  onFieldChange,
}) => {
  const seedTypes = ['Somersets', 'Sunflower', 'Somerroots', 'Someroots'];

  const InfoRow = ({ 
    label, 
    value, 
    icon, 
    isStatus = false 
  }: { 
    label: string; 
    value: React.ReactNode; 
    icon?: React.ReactNode;
    isStatus?: boolean;
  }) => (
    <Box sx={styles.infoRow}>
      <Typography sx={styles.label}>{label}</Typography>
      <Box sx={styles.valueContainer}>
        {icon && <Box sx={styles.icon}>{icon}</Box>}
        {isStatus ? (
          <Chip 
            label={value as string} 
            color="success" 
            size="small" 
            sx={styles.statusChip}
          />
        ) : (
          <Typography sx={styles.value}>{value}</Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <BaseInfoCard title="Container Information">
      <Box sx={styles.content}>
        <InfoRow label="Name" value={container.name} />
        
        <InfoRow 
          label="Type" 
          value={container.type === 'physical' ? 'Physical' : 'Virtual'}
          icon={container.type === 'physical' ? <Factory fontSize="small" /> : <Computer fontSize="small" />}
        />
        
        <InfoRow label="Tenant" value={container.tenant.name} />
        
        <InfoRow 
          label="Purpose" 
          value={
            isEditMode ? (
              <TextField
                value={formData.purpose}
                onChange={(e) => onFieldChange('purpose', e.target.value)}
                size="small"
                fullWidth
                sx={styles.textField}
              />
            ) : (
              formData.purpose
            )
          }
        />
        
        <InfoRow 
          label="Location" 
          value={
            typeof container.location === 'object' && container.location.city
              ? `${container.location.city}, ${container.location.country}`
              : 'Lviv, Ukraine'
          }
          icon={<LocationOn fontSize="small" />}
        />
        
        <InfoRow label="Status" value="Active" isStatus />
        
        <InfoRow 
          label="Created" 
          value="30/01/2025, 09:30"
          icon={<AccessTime fontSize="small" />}
        />
        
        <InfoRow label="Last Modified" value="30/01/2025, 11:14" />
        
        <InfoRow 
          label="Creator" 
          value="Mia Adams"
          icon={<Person fontSize="small" />}
        />
        
        <InfoRow label="Seed Type" value={seedTypes.join(', ')} />
        
        <Box sx={styles.notesSection}>
          <Typography sx={styles.notesLabel}>Notes</Typography>
          {isEditMode ? (
            <TextField
              value={formData.notes}
              onChange={(e) => onFieldChange('notes', e.target.value)}
              multiline
              rows={3}
              fullWidth
              size="small"
              sx={styles.notesField}
            />
          ) : (
            <Typography sx={styles.notesText}>{formData.notes}</Typography>
          )}
        </Box>
      </Box>
    </BaseInfoCard>
  );
};