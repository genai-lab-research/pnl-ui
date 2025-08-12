import { SxProps, Theme } from '@mui/material/styles';

export const recentActivitySectionStyles = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '8px',
    boxShadow: 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  } as SxProps<Theme>,

  cardContent: {
    padding: '24px',
    paddingBottom: '16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    '&:last-child': {
      paddingBottom: '16px',
    },
  } as SxProps<Theme>,

  title: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '28px',
    color: '#000000',
    marginBottom: 2,
  } as SxProps<Theme>,

  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '480px',
    paddingRight: '4px',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F3F4F6',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#D1D5DB',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: '#9CA3AF',
      },
    },
  } as SxProps<Theme>,

  activityList: {
    padding: 0,
  } as SxProps<Theme>,

  activityItem: {
    padding: '12px 0',
    alignItems: 'flex-start',
  } as SxProps<Theme>,

  activityAvatar: {
    width: 32,
    height: 32,
    marginRight: 2,
    '& .MuiSvgIcon-root': {
      fontSize: 18,
      color: 'white',
    },
  } as SxProps<Theme>,

  activityContent: {
    flex: 1,
    minWidth: 0,
  } as SxProps<Theme>,

  activityDescription: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#374151',
    marginBottom: 0.5,
    wordBreak: 'break-word',
  } as SxProps<Theme>,

  activityMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  } as SxProps<Theme>,

  activityTime: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: 500,
  } as SxProps<Theme>,

  activityActor: {
    fontSize: '12px',
    color: '#9CA3AF',
  } as SxProps<Theme>,

  activityDivider: {
    marginLeft: '48px',
    marginRight: 0,
    backgroundColor: '#F3F4F6',
  } as SxProps<Theme>,

  loadingItem: {
    padding: '12px 0',
    alignItems: 'flex-start',
  } as SxProps<Theme>,

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    gap: 2,
  } as SxProps<Theme>,

  emptyIcon: {
    fontSize: 48,
    color: '#D1D5DB',
  } as SxProps<Theme>,
};
