import { styled } from '@mui/material/styles';
import { TableContainer, TableHead, TableCell, TableRow, Box } from '@mui/material';
import { background, text, border, secondary, status, interactive } from '../../../styles/colors';

export const StyledTableContainer = styled(TableContainer)(() => ({
  borderRadius: '6px',
  border: `1px solid ${border.tertiary}`,
  boxShadow: 'none',
  overflow: 'hidden',
}));

export const StyledTableHead = styled(TableHead)({
  backgroundColor: background.secondary,
});

export const StyledHeaderCell = styled(TableCell)({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: secondary.main,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: '12px 16px',
  borderBottom: `1px solid ${border.tertiary}`,
});

export const StyledSortableHeaderCell = styled(StyledHeaderCell)({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: interactive.hover,
  },
  '& .MuiTableSortLabel-root': {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    color: secondary.main,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    '&:hover': {
      color: status.info,
    },
    '&.Mui-active': {
      color: status.info,
      '& .MuiTableSortLabel-icon': {
        color: `${status.info} !important`,
      },
    },
  },
});

export const StyledTableRow = styled(TableRow)({
  height: '52px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: background.secondary,
  },
  '&:not(:last-child)': {
    borderBottom: `1px solid ${border.tertiary}`,
  },
});

export const StyledTableCell = styled(TableCell)({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  color: text.primary,
  padding: '12px 16px',
  borderBottom: 'none',
});

export const TypeIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const AlertIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasAlert',
})<{ hasAlert: boolean }>(({ hasAlert }) => ({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: hasAlert ? status.errorAlt : secondary.light,
  border: `2px solid ${hasAlert ? background.primary : 'transparent'}`,
  position: 'relative',
  '&::after': hasAlert ? {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '6px',
    height: '6px',
    backgroundColor: background.primary,
    borderRadius: '50%',
  } : {},
}));