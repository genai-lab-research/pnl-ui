import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'text.primary',
    mb: 2,
  },
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    py: 1,
    minHeight: 40,
  },
  settingLabel: {
    fontSize: '0.875rem',
    color: 'text.primary',
    fontWeight: 400,
  },
  settingValue: {
    fontSize: '0.875rem',
    color: 'text.primary',
    fontWeight: 400,
  },
  switch: {
    '&.MuiSwitch-root': {
      width: 42,
      height: 26,
      padding: 0,
      '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          color: '#fff',
          '& + .MuiSwitch-track': {
            backgroundColor: (theme) => theme.palette.success.main,
            opacity: 1,
            border: 0,
          },
        },
      },
      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
      },
      '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: (theme) => theme.palette.grey[400],
        opacity: 1,
      },
    },
  },
  integrationLink: {
    fontSize: '0.875rem',
    fontWeight: 400,
    color: 'primary.main',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    '&:hover': {
      textDecoration: 'underline',
    },
    '&::after': {
      content: '"↗"',
      fontSize: '0.75rem',
      color: 'primary.main',
    },
  },
  disabledLink: {
    color: 'text.disabled',
    cursor: 'default',
    '&:hover': {
      textDecoration: 'none',
    },
    '&::after': {
      color: 'text.disabled',
    },
  },
  footer: {
    mt: 3,
    pt: 2,
    borderTop: '1px solid',
    borderColor: 'divider',
  },
  footerNote: {
    fontSize: '0.75rem',
    color: 'text.secondary',
    fontStyle: 'italic',
  },
};