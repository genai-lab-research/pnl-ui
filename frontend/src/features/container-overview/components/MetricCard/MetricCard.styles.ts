import { SxProps, Theme } from '@mui/material/styles';

export const metricCardStyles: Record<string, SxProps<Theme>> = {
  card: {
    height: 100,
    minHeight: 100,
    borderRadius: 2,
    border: '1px solid #E4E4E7',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
  },
  
  cardHover: {
    transform: 'translateY(-2px)',
    transition: 'transform 0.2s ease-in-out',
  },
  
  cardContent: {
    p: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:last-child': {
      pb: 2,
    },
  },
  
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1,
    mb: 1,
  },
  
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    flexShrink: 0,
  },
  
  icon: {
    fontSize: 20,
    color: 'inherit',
  },
  
  title: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#71717A',
    lineHeight: 1.2,
    flex: 1,
  },
  
  valueContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 0.5,
    mb: 0.5,
  },
  
  value: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#0F1729',
    lineHeight: 1,
  },
  
  unit: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#71717A',
  },
  
  subtitle: {
    fontSize: '0.625rem',
    color: '#71717A',
    lineHeight: 1.2,
  },
  
  change: {
    fontSize: '0.625rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
};