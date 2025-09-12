import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledContainerSearchFilters = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],

  '& .search-section': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: '100%'
  },

  '& .filters-section': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },

  '& .alerts-toggle': {
    marginLeft: 'auto',
    
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0
    }
  }
}));