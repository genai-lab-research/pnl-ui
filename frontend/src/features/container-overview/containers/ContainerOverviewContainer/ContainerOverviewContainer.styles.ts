import { SxProps, Theme } from '@mui/material/styles';

export const containerOverviewContainerStyles = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#F7F9FD',
    display: 'flex',
    flexDirection: 'column',
  } as SxProps<Theme>,

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    backgroundColor: '#F7F9FD',
  } as SxProps<Theme>,

  errorContainer: {
    padding: 3,
    backgroundColor: '#F7F9FD',
    minHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as SxProps<Theme>,

  errorBanner: {
    padding: '0 24px',
    backgroundColor: '#F7F9FD',
  } as SxProps<Theme>,

  content: {
    flex: 1,
    padding: '24px',
    paddingTop: 0,
  } as SxProps<Theme>,

  placeholderTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #E4E4E7',
    fontSize: '18px',
    color: '#71717A',
    fontWeight: 500,
  } as SxProps<Theme>,
};
