import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledContainerMetricsOverview = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),

  '& .time-range-selector': {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(3)
  },

  '& .metrics-grid': {
    '& .metric-card': {
      height: '100%',
      cursor: 'pointer',
      transition: theme.transitions.create(['transform', 'box-shadow'], {
        duration: theme.transitions.duration.short
      }),

      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[8]
      },

      '&.selected': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '10'
      }
    }
  },

  '& .error-state': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.error.light + '20',
    border: `1px solid ${theme.palette.error.light}`,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.error.dark
  }
}));