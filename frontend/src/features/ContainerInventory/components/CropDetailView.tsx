import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { inventoryManagementService } from '../../../api/inventoryManagementService';
import { Crop } from '../../../types/inventory';

/**
 * CropDetailView Component
 * 
 * Displays detailed information about a specific crop.
 * Can be accessed directly via route or displayed in a dialog.
 */
export const CropDetailView: React.FC = () => {
  const { containerId, cropId } = useParams<{ containerId: string; cropId: string }>();
  const navigate = useNavigate();
  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCropDetails = async () => {
      if (!containerId || !cropId) {
        setError('Missing container or crop ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await inventoryManagementService.getCrop(containerId, cropId);
        
        if (response.error) {
          setError(response.error.detail);
        } else if (response.data) {
          setCrop(response.data);
        }
      } catch {
        setError('Failed to fetch crop details');
      } finally {
        setLoading(false);
      }
    };

    fetchCropDetails();
  }, [containerId, cropId]);

  const handleBack = () => {
    navigate(`/containers/${containerId}/inventory`);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          Back to Inventory
        </Button>
      </Container>
    );
  }

  if (!crop) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>No crop data found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          Back to Inventory
        </Button>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'growing':
      case 'healthy':
        return 'success';
      case 'overdue':
        return 'warning';
      case 'harvested':
        return 'info';
      default:
        return 'default';
    }
  };

  const getLocationDisplay = () => {
    if (crop.location.type === 'tray') {
      return `Tray ${crop.location.tray_id}, Row ${crop.location.row}, Column ${crop.location.column}`;
    } else {
      return `Panel ${crop.location.panel_id}, Channel ${crop.location.channel}, Position ${crop.location.position}`;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 3 }}>
        Back to Inventory
      </Button>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {crop.seed_type}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              label={crop.status} 
              color={getStatusColor(crop.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
              size="small"
            />
            {crop.overdue_days > 0 && (
              <Chip 
                label={`${crop.overdue_days} days overdue`} 
                color="warning"
                size="small"
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Growth Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Age
                </Typography>
                <Typography variant="body1">
                  {crop.age} days
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Seeded Date
                </Typography>
                <Typography variant="body1">
                  {new Date(crop.seed_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              {crop.transplanted_date && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Transplanted Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(crop.transplanted_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Planning Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Planned Transplanting Date
                </Typography>
                <Typography variant="body1">
                  {new Date(crop.transplanting_date_planned).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Planned Harvesting Date
                </Typography>
                <Typography variant="body1">
                  {new Date(crop.harvesting_date_planned).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              {crop.harvesting_date && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Actual Harvesting Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(crop.harvesting_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Typography variant="body1">
              {getLocationDisplay()}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Crop ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {crop.id}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};