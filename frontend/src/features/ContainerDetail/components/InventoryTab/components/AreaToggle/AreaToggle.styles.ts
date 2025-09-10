import { styled } from '@mui/material/styles';
import { ToggleButtonGroup } from '@mui/material';

export const StyledToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '& .MuiToggleButton-root': {
    border: 'none',
    textTransform: 'none',
    fontWeight: 500,
    padding: theme.spacing(1, 3),
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));