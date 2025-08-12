import { SxProps, Theme } from '@mui/material/styles';

export const dashboardMetricsSectionStyles = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '8px',
    boxShadow: 'none',
    height: '100%',
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
    flexWrap: 'wrap',
    gap: 2,
  } as SxProps<Theme>,

  title: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '28px',
    color: '#000000',
  } as SxProps<Theme>,

  metricsGrid: {
    '& .MuiGrid-item': {
      display: 'flex',
    },
  } as SxProps<Theme>,

  divider: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as SxProps<Theme>,

  verticalLine: {
    width: '1px',
    height: '97px',
    backgroundColor: '#E5E9F0',
  } as SxProps<Theme>,

  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: 3,
  } as SxProps<Theme>,
};
