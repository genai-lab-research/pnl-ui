import { styled } from '@mui/material/styles';
import { TableContainer, TableCell } from '@mui/material';
import { background, border, text } from '../../../styles/colors';

export const StyledTableContainer = styled(TableContainer)(() => ({
  backgroundColor: background.primary,
  border: `1px solid ${border.primary}`,
  borderRadius: '8px',
  boxShadow: 'none',
  '& .MuiTable-root': {
    minWidth: 650,
  },
}));

export const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  color: text.tertiary,
  backgroundColor: background.container,
  borderBottom: `1px solid ${border.primary}`,
  padding: theme.spacing(2),
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  color: text.secondary,
  borderBottom: `1px solid ${border.light}`,
  padding: theme.spacing(2),
}));