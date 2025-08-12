import { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  root: {
    borderRadius: 2,
    overflow: 'hidden'
  } as SxProps<Theme>,

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 3,
    pb: 2,
    borderBottom: '1px solid',
    borderColor: 'divider'
  } as SxProps<Theme>,

  title: {
    fontWeight: 600,
    color: 'text.primary'
  } as SxProps<Theme>,

  expandButton: {
    ml: 1
  } as SxProps<Theme>,

  tableContainer: {
    overflowX: 'auto'
  } as SxProps<Theme>,

  table: {
    minWidth: { xs: 300, sm: 500, md: 650 }
  } as SxProps<Theme>,

  headerCell: {
    fontWeight: 600,
    fontSize: '12px',
    color: 'text.secondary',
    py: 2,
    borderBottom: '2px solid',
    borderColor: 'divider',
    backgroundColor: 'grey.50'
  } as SxProps<Theme>,

  dataRow: {
    '&:hover': {
      backgroundColor: 'action.hover'
    }
  } as SxProps<Theme>,

  seedTypeCell: {
    fontWeight: 500,
    color: 'text.primary'
  } as SxProps<Theme>,

  emptyCell: {
    py: 4,
    color: 'text.secondary'
  } as SxProps<Theme>,

  pagination: {
    borderTop: '1px solid',
    borderColor: 'divider'
  } as SxProps<Theme>
};