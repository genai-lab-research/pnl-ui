import { SxProps, Theme } from '@mui/material/styles';

export const containerInfoSectionStyles = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '8px',
    boxShadow: 'none',
    height: 'fit-content',
  } as SxProps<Theme>,

  cardContent: {
    padding: '24px',
    '&:last-child': {
      paddingBottom: '24px',
    },
  } as SxProps<Theme>,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  } as SxProps<Theme>,

  title: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '28px',
    color: '#000000',
  } as SxProps<Theme>,

  actionButtons: {
    display: 'flex',
    gap: 1,
  } as SxProps<Theme>,

  editButton: {
    textTransform: 'none',
    fontSize: '14px',
    borderColor: '#D1D5DB',
    color: '#374151',
    '&:hover': {
      borderColor: '#9CA3AF',
      backgroundColor: '#F9FAFB',
    },
  } as SxProps<Theme>,

  saveButton: {
    textTransform: 'none',
    fontSize: '14px',
    backgroundColor: '#1976D2',
    '&:hover': {
      backgroundColor: '#1565C0',
    },
  } as SxProps<Theme>,

  cancelButton: {
    textTransform: 'none',
    fontSize: '14px',
    color: '#6B7280',
    '&:hover': {
      backgroundColor: '#F3F4F6',
    },
  } as SxProps<Theme>,

  fieldGroup: {
    marginBottom: 2,
  } as SxProps<Theme>,

  fieldLabel: {
    fontWeight: 600,
    fontSize: '14px',
    color: '#374151',
    marginBottom: 1,
    display: 'block',
  } as SxProps<Theme>,

  fieldValue: {
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: '20px',
  } as SxProps<Theme>,

  sectionTitle: {
    fontWeight: 600,
    fontSize: '16px',
    color: '#111827',
    marginBottom: 2,
  } as SxProps<Theme>,

  switchLabel: {
    fontSize: '14px',
    color: '#374151',
  } as SxProps<Theme>,

  ecosystemSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  } as SxProps<Theme>,

  ecosystemLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    marginTop: 1,
  } as SxProps<Theme>,

  ecosystemChip: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    '&:hover': {
      backgroundColor: '#BBDEFB',
    },
    '& .MuiChip-icon': {
      color: '#1976D2',
    },
  } as SxProps<Theme>,

  // New styles for the 3-column layout
  column: {
    height: '100%',
  } as SxProps<Theme>,

  columnTitle: {
    fontWeight: 500,
    fontSize: '16px',
    color: '#000000',
    marginBottom: 3,
    paddingBottom: 1,
    borderBottom: '1px solid #F3F4F6',
  } as SxProps<Theme>,

  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.5,
    marginBottom: 2,
    paddingBottom: 2,
    borderBottom: '1px solid #F9FAFB',
    '&:last-child': {
      marginBottom: 0,
      paddingBottom: 0,
      borderBottom: 'none',
    },
  } as SxProps<Theme>,

  activityIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#F3F4F6',
    flexShrink: 0,
  } as SxProps<Theme>,

  activityContent: {
    flex: 1,
    minWidth: 0,
  } as SxProps<Theme>,

  activityDescription: {
    fontSize: '14px',
    color: '#111827',
    lineHeight: '20px',
    marginBottom: 0.5,
  } as SxProps<Theme>,

  activityMeta: {
    fontSize: '12px',
    color: '#6B7280',
    lineHeight: '16px',
  } as SxProps<Theme>,
};
