import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Container, Paper } from '@mui/material';
import ContainerHeader from '../shared/components/ui/ContainerHeader';
import NavigationButtons from './NavigationButtons';

export const ContainerHeaderExample: React.FC = () => {
  const [title, setTitle] = useState<string>('farm-container-04');
  const [metadata, setMetadata] = useState<string>('Physical container | Tenant-123 | Development');
  const [status, setStatus] = useState<'active' | 'inactive' | 'in-progress' | 'default'>('active');

  // Preview at different screen sizes
  const previewSizes = [
    { name: 'Mobile', width: 375 },
    { name: 'Tablet', width: 768 },
    { name: 'Desktop', width: 1024 },
    { name: 'Full Width', width: '100%' },
  ];

  const [selectedPreviewSize, setSelectedPreviewSize] = useState<number | string>(previewSizes[3].width);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <NavigationButtons />
      
      <Box sx={{ mb: 4 }}>
        <h1>Container Header Component</h1>
        <p>
          This example demonstrates the Container Header component with various configurations 
          and responsive behaviors. You can use the controls below to customize the component
          and see how it responds to different settings.
        </p>
      </Box>
      
      {/* Control panel */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={1}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          
          <TextField
            label="Metadata"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            sx={{ minWidth: 300, flexGrow: 1 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive' | 'in-progress' | 'default')}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="default">Default</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {previewSizes.map((size) => (
            <Button 
              key={size.name}
              variant={selectedPreviewSize === size.width ? "contained" : "outlined"}
              onClick={() => setSelectedPreviewSize(size.width)}
              size="small"
            >
              {size.name}
            </Button>
          ))}
        </Box>
      </Paper>
      
      {/* Component preview */}
      <Box sx={{ mb: 4 }}>
        <h2>Preview</h2>
        <Paper 
          sx={{ 
            width: typeof selectedPreviewSize === 'number' ? `${selectedPreviewSize}px` : selectedPreviewSize,
            maxWidth: '100%',
            p: 2,
            mx: 'auto',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }} 
          elevation={0}
        >
          <ContainerHeader
            title={title}
            metadata={metadata}
            status={status}
          />
        </Paper>
        
        {typeof selectedPreviewSize === 'number' && (
          <Box sx={{ textAlign: 'center', mt: 1, color: 'text.secondary' }}>
            Preview width: {selectedPreviewSize}px
          </Box>
        )}
      </Box>
      
      {/* Responsive breakdown */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={1}>
        <h2>Responsive Behavior</h2>
        <ul>
          <li><strong>Desktop (≥900px):</strong> Full layout with all elements in a row</li>
          <li><strong>Tablet (600px-899px):</strong> Reduced title font size but maintaining the row layout</li>
          <li><strong>Mobile (&lt;600px):</strong> Title takes full width, metadata and status on row below</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default ContainerHeaderExample;