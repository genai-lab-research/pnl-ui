import { styled } from '@mui/material/styles';
import { TableContainer, TableCell } from '@mui/material';

export const StyledTableContainer = styled(TableContainer)(() => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E7',
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
  color: '#49454F',
  backgroundColor: '#F7F9FE',
  borderBottom: '1px solid #E4E4E7',
  padding: theme.spacing(2),
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  color: '#09090B',
  borderBottom: '1px solid #F1F1F1',
  padding: theme.spacing(2),
}));