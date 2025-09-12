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
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
}));

export const ShelfSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
}));

export const ShelfGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  /* Use fixed card column width so items align like the mock */
  gridTemplateColumns: 'repeat(auto-fill, minmax(162px, 1fr))',
  gap: theme.spacing(2.5),
  alignItems: 'start',
  /* Prevent odd spacing by keeping content left-aligned */
  justifyItems: 'start',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(140px, 1fr))',
    gap: theme.spacing(2),
  },
  [theme.breakpoints.between('sm', 'md')]: {
    gridTemplateColumns: 'repeat(3, minmax(162px, 1fr))',
  },
  [theme.breakpoints.between('md', 'lg')]: {
    gridTemplateColumns: 'repeat(4, minmax(162px, 1fr))',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(6, minmax(162px, 1fr))',
  },
}));