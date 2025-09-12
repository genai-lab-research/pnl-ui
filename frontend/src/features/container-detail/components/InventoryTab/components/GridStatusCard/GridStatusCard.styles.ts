import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

interface CardContainerProps {
  status?: 'active' | 'warning' | 'inactive';
}

export const CardContainer = styled(Box)<CardContainerProps>(({ theme, status }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${
    status === 'warning' ? '#ff9800' : 
    status === 'inactive' ? '#e0e0e0' :
    '#4caf50'
  }`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  minWidth: '200px',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[2],
    transform: 'translateY(-2px)',
  },
}));

export const CardHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const UtilizationBar = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const GridVisualization = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  padding: theme.spacing(1, 0),
  margin: theme.spacing(2, 0),
  justifyContent: 'center',
  alignItems: 'center',
}));

interface GridDotProps {
  filled: boolean;
  status?: 'active' | 'warning' | 'inactive';
}

export const GridDot = styled(Box)<GridDotProps>(({ filled, status }) => ({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: filled ? (
    status === 'warning' ? '#ff9800' :
    status === 'inactive' ? '#9e9e9e' :
    '#4caf50'
  ) : '#e0e0e0',
  transition: 'background-color 0.2s ease',
}));

export const CardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
}));