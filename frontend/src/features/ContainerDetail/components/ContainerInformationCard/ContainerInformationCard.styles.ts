import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    py: 0.5,
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'text.secondary',
    minWidth: '120px',
  },
  valueContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flex: 1,
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: '0.875rem',
    color: 'text.primary',
    textAlign: 'right',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    color: 'text.secondary',
  },
  statusChip: {
    height: '24px',
    '& .MuiChip-label': {
      fontSize: '0.75rem',
      px: 1.5,
    },
  },
  textField: {
    '& .MuiInputBase-root': {
      fontSize: '0.875rem',
    },
  },
  notesSection: {
    mt: 2,
    pt: 2,
    borderTop: '1px solid',
    borderColor: 'divider',
  },
  notesLabel: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'text.secondary',
    mb: 1,
  },
  notesText: {
    fontSize: '0.875rem',
    color: 'text.primary',
    lineHeight: 1.6,
  },
  notesField: {
    '& .MuiInputBase-root': {
      fontSize: '0.875rem',
    },
  },
};