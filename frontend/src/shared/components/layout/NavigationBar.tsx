import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';

interface NavigationItem {
  label: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Containers', path: '/containers' },
  { label: 'Metrics', path: '/metrics' },
  { label: 'Example', path: '/example' },
];

interface NavigationBarProps {
  title?: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ title = 'Farm OS' }) => {
  const location = useLocation();

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white' }}
          >
            {title}
          </Typography>

          <Box sx={{ display: 'flex' }}>
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: 'white',
                  mx: 1,
                  px: 2,
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  backgroundColor:
                    location.pathname === item.path ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
