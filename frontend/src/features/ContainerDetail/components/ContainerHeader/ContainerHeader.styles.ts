import { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  root: {
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    bgcolor: 'background.paper',
    borderBottom: '1px solid',
    borderColor: 'divider',
    px: 3,
    pt: 2,
    pb: 0
  } as SxProps<Theme>,

  topSection: {
    mb: 2
  } as SxProps<Theme>,

  infoSection: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    mb: 2
  } as SxProps<Theme>,

  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1
  } as SxProps<Theme>,

  title: {
    fontWeight: 700,
    fontSize: '30px',
    lineHeight: 1.2,
    color: 'text.primary'
  } as SxProps<Theme>,

  metaInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    flexWrap: 'wrap'
  } as SxProps<Theme>,

  containerType: {
    fontSize: '14px',
    color: 'text.secondary',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    textTransform: 'capitalize'
  } as SxProps<Theme>,

  separator: {
    fontSize: '14px',
    color: 'text.disabled'
  } as SxProps<Theme>,

  tenantName: {
    fontSize: '14px',
    color: 'text.secondary'
  } as SxProps<Theme>,

  location: {
    fontSize: '14px',
    color: 'text.secondary'
  } as SxProps<Theme>,

  statusChip: {
    textTransform: 'capitalize',
    fontWeight: 500
  } as SxProps<Theme>,

  tabSection: {
    borderColor: 'divider',
    mx: -3,
    px: 3
  } as SxProps<Theme>
};