import { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  root: {
    borderRadius: 2,
    overflow: 'hidden',
    height: '100%'
  } as SxProps<Theme>,

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 3,
    pb: 2,
    borderBottom: '1px solid',
    borderColor: 'divider'
  } as SxProps<Theme>,

  titleContainer: {
    display: 'flex',
    alignItems: 'center'
  } as SxProps<Theme>,

  title: {
    fontWeight: 600,
    color: 'text.primary'
  } as SxProps<Theme>,

  expandButton: {
    ml: 1
  } as SxProps<Theme>,

  content: {
    p: 3
  } as SxProps<Theme>,

  sectionTitle: {
    fontWeight: 600,
    color: 'text.primary',
    mb: 2
  } as SxProps<Theme>,

  infoRow: {
    display: 'flex',
    mb: 1.5,
    minHeight: '32px',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'flex-start', sm: 'center' }
  } as SxProps<Theme>,

  label: {
    fontSize: '14px',
    color: 'text.secondary',
    minWidth: { xs: '100%', sm: '140px' },
    flexShrink: 0,
    mb: { xs: 0.5, sm: 0 }
  } as SxProps<Theme>,

  value: {
    fontSize: '14px',
    color: 'text.primary',
    flex: 1
  } as SxProps<Theme>,

  notesRow: {
    display: 'flex',
    alignItems: 'flex-start',
    mt: 2
  } as SxProps<Theme>,

  settingsSection: {
    mb: 2
  } as SxProps<Theme>,

  settingsSubtitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'text.primary',
    mb: 1
  } as SxProps<Theme>,

  switchControl: {
    '& .MuiFormControlLabel-label': {
      fontSize: '14px'
    }
  } as SxProps<Theme>,

  integrationLinks: {
    mt: 2,
    ml: 2
  } as SxProps<Theme>,

  integrationRow: {
    display: 'flex',
    alignItems: 'center',
    mb: 1
  } as SxProps<Theme>,

  link: {
    fontSize: '14px',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  } as SxProps<Theme>,

  actionButtons: {
    display: 'flex',
    gap: 2,
    mt: 3,
    pt: 3,
    borderTop: '1px solid',
    borderColor: 'divider'
  } as SxProps<Theme>
};