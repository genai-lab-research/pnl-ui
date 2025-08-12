import { SxProps, Theme } from '@mui/material/styles';

export const cropsSummarySectionStyles = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '8px',
    boxShadow: 'none',
    height: 'fit-content',
    minHeight: '420px',
  } as SxProps<Theme>,

  cardContent: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  } as SxProps<Theme>,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 0 24px',
    marginBottom: 2,
  } as SxProps<Theme>,

  title: {
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '24px',
    color: '#000000',
  } as SxProps<Theme>,

  expandButton: {
    color: '#71717A',
    '&:hover': {
      backgroundColor: '#F3F4F6',
    },
  } as SxProps<Theme>,

  tableContainer: {
    borderRadius: '6px',
    margin: '0 24px 24px 24px',
    border: '1px solid #E9EDF4',
  } as SxProps<Theme>,

  table: {
    minWidth: 650,
  } as SxProps<Theme>,

  tableHeader: {
    backgroundColor: '#F8F9FA',
    '& th': {
      borderBottom: '1px solid #E9EDF4',
    },
  } as SxProps<Theme>,

  headerCell: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '16px 12px',
    lineHeight: '16px',
  } as SxProps<Theme>,

  tableRow: {
    '&:hover': {
      backgroundColor: '#FAFAFA',
    },
    '&:not(:last-child)': {
      '& td': {
        borderBottom: '1px solid #F3F4F6',
      },
    },
  } as SxProps<Theme>,

  dataCell: {
    fontSize: '14px',
    color: '#374151',
    padding: '16px 12px',
    lineHeight: '20px',
  } as SxProps<Theme>,

  seedType: {
    fontWeight: 500,
    color: '#111827',
  } as SxProps<Theme>,

  overdueChip: {
    fontSize: '12px',
    fontWeight: 600,
    height: '24px',
    minWidth: '32px',
    borderRadius: '12px',
  } as SxProps<Theme>,

  emptyState: {
    textAlign: 'center',
    padding: '40px 16px',
  } as SxProps<Theme>,

  paginationContainer: {
    padding: '16px 24px',
    borderTop: '1px solid #F3F4F6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as SxProps<Theme>,

  paginationText: {
    fontSize: '14px',
    color: '#6B7280',
  } as SxProps<Theme>,

  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  } as SxProps<Theme>,

  paginationButton: {
    textTransform: 'none',
    fontSize: '14px',
    color: '#6B7280',
    minWidth: 'auto',
    '&:disabled': {
      color: '#D1D5DB',
    },
  } as SxProps<Theme>,

  paginationInfo: {
    fontSize: '14px',
    color: '#6B7280',
  } as SxProps<Theme>,
};
