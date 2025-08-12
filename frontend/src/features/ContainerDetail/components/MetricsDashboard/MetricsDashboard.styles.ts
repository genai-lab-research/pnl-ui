import { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  root: {
    p: 3,
    borderRadius: 2,
    bgcolor: '#ffffff',
    boxShadow: 1
  } as SxProps<Theme>,

  metricsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 0,
    bgcolor: 'transparent',
    borderRadius: 2,
    overflow: 'hidden',
    height: 100,
    flexWrap: 'nowrap',
    overflowX: 'auto'
  } as SxProps<Theme>,

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 3,
    flexWrap: 'nowrap',
    gap: 2,
    position: 'relative'
  } as SxProps<Theme>,

  timeRangeWrapper: {
    zIndex: 1
  } as SxProps<Theme>,

  title: {
    fontWeight: 600,
    color: 'text.primary'
  } as SxProps<Theme>
};