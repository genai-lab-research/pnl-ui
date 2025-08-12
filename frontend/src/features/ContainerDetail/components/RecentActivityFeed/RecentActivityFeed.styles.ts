import { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  root: {
    borderRadius: 2,
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  } as SxProps<Theme>,

  header: {
    p: 3,
    pb: 2,
    borderBottom: '1px solid',
    borderColor: 'divider'
  } as SxProps<Theme>,

  title: {
    fontWeight: 600,
    color: 'text.primary'
  } as SxProps<Theme>,

  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    p: 3,
    maxHeight: '600px',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'grey.100',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'grey.400',
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: 'grey.500'
      }
    }
  } as SxProps<Theme>,

  activityItem: {
    pb: 2,
    mb: 2,
    borderBottom: '1px solid',
    borderColor: 'divider',
    '&:last-child': {
      mb: 0,
      pb: 0,
      borderBottom: 'none'
    }
  } as SxProps<Theme>,

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    py: 2
  } as SxProps<Theme>,

  endMessage: {
    textAlign: 'center',
    color: 'text.secondary',
    fontSize: '14px',
    py: 2
  } as SxProps<Theme>,

  emptyMessage: {
    textAlign: 'center',
    color: 'text.secondary',
    py: 4
  } as SxProps<Theme>
};