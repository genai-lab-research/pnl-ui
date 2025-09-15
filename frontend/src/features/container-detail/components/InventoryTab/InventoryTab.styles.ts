import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const InventoryTabContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: '600px',
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
}));

export const ShelfSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
}));

export const ShelfGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  /* Fixed-width tracks so cards don't stretch and align like mock */
  gridTemplateColumns: 'repeat(auto-fill, 162px)',
  columnGap: theme.spacing(3),
  rowGap: theme.spacing(3),
  alignItems: 'start',
  justifyItems: 'start',
  justifyContent: 'flex-start',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(auto-fill, 140px)',
    columnGap: theme.spacing(2),
    rowGap: theme.spacing(2),
  },
}));