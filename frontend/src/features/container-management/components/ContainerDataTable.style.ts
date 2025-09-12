import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledContainerDataTable = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),

  '& .table-header': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: theme.spacing(2),
      alignItems: 'stretch'
    }
  },

  '& .table-title': {
    fontWeight: 600,
    color: theme.palette.text.primary
  },

  '& .table-wrapper': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    overflow: 'hidden'
  },

  '& .pagination-wrapper': {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2)
  }
}));
