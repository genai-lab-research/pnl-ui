import { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    bgcolor: 'background.default'
  } as SxProps<Theme>,

  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%'
  } as SxProps<Theme>,

  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    p: 4
  } as SxProps<Theme>,

  content: {
    flex: 1,
    overflow: 'auto',
    width: '100%'
  } as SxProps<Theme>,

  tabContent: {
    p: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: 'text.secondary'
  } as SxProps<Theme>
};