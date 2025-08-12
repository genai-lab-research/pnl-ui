import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  root: {
    p: 2.5,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  outlined: {
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
  },
  title: {
    fontWeight: 600,
    fontSize: '1.125rem',
    color: 'text.primary',
    mb: 2,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
};