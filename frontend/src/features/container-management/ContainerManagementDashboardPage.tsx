import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Fade, Skeleton, Alert } from '@mui/material';
import { useAuthState } from '../../context/AuthContext';
import { ContainerUserProfile } from '../container-detail/components';
import { useSearchParams } from 'react-router-dom';
import { ContainerSearchFilters } from './components/ContainerSearchFilters';
import { ContainerMetricsOverview } from './components/ContainerMetricsOverview';
import { ContainerDataTable } from './components/ContainerDataTable';
import { useContainerFilters } from './hooks/useContainerFilters';

const ContainerManagementDashboardPage: React.FC = () => {
  const auth = useAuthState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasAppliedUrlFilters = useRef(false);

  // Get initial filter values from URL params
  const getInitialFilters = () => {
    const type = searchParams.get('type');
    return {
      type: type === 'physical' ? 'physical' as const : 
            type === 'virtual' ? 'virtual' as const : 
            'all' as const
    };
  };

  // Shared filter state for all components
  const containerFilters = useContainerFilters({
    initialFilters: getInitialFilters()
  });

  // Apply URL filter params on mount (only once)
  useEffect(() => {
    if (hasAppliedUrlFilters.current) return;
    
    const type = searchParams.get('type');
    if (type === 'physical') {
      containerFilters.setTypeFilter('physical');
      hasAppliedUrlFilters.current = true;
      setSearchParams({}); // Clear URL params after applying
    } else if (type === 'virtual') {
      containerFilters.setTypeFilter('virtual');
      hasAppliedUrlFilters.current = true;
      setSearchParams({}); // Clear URL params after applying
    }
  }, [searchParams, containerFilters, setSearchParams]);

  // Simulate initial loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Skeleton variant="text" width={400} height={48} sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
        </Box>
        
        <Box sx={{ mb: 4, display: 'flex', gap: 3 }}>
          <Skeleton variant="rectangular" width="50%" height={200} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="50%" height={200} sx={{ borderRadius: 1 }} />
        </Box>
        
        <Box>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <button onClick={() => setError(null)}>Retry</button>
            </Box>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Fade in={!isInitialLoading} timeout={800}>
      <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography 
              component="h1" 
              sx={{ 
                fontSize: { xs: 22, sm: 26, md: 28 },
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#0f172a'
              }}
            >
              Container Managements
            </Typography>
          </Box>
          <ContainerUserProfile 
            userName={auth.user?.username || 'User'}
            avatarUrl={undefined}
            size="medium"
          />
        </Box>
        
        <Fade in timeout={1000} style={{ transitionDelay: '200ms' }}>
          <Box sx={{ mb: 4 }}>
            <ContainerSearchFilters containerFilters={containerFilters} />
          </Box>
        </Fade>
        
        <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
          <Box sx={{ mb: 4 }}>
            <ContainerMetricsOverview containerFilters={containerFilters} />
          </Box>
        </Fade>
        
        <Fade in timeout={1000} style={{ transitionDelay: '600ms' }}>
          <Box>
            <ContainerDataTable containerFilters={containerFilters} />
          </Box>
        </Fade>
      </Box>
    </Fade>
  );
};

export default ContainerManagementDashboardPage;