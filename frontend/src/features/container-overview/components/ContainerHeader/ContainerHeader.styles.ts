import { SxProps, Theme } from '@mui/material/styles';

export const containerHeaderStyles = {
  root: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  } as SxProps<Theme>,

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    minHeight: 56,
  } as SxProps<Theme>,

  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#F3F4F6',
    },
  } as SxProps<Theme>,

  breadcrumbText: {
    color: '#374151',
    fontWeight: 500,
  } as SxProps<Theme>,

  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  } as SxProps<Theme>,

  refreshButton: {
    color: '#6B7280',
    '&:hover': {
      backgroundColor: '#F3F4F6',
    },
  } as SxProps<Theme>,

  userIcon: {
    fontSize: 32,
    color: '#6B7280',
  } as SxProps<Theme>,

  mainHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '0 24px 28px 24px',
    gap: 2,
  } as SxProps<Theme>,

  titleSection: {
    flex: 1,
    minWidth: 0,
  } as SxProps<Theme>,

  containerName: {
    fontWeight: 700,
    fontSize: '30px',
    lineHeight: '36px',
    letterSpacing: '-0.75px',
    color: '#000000',
    marginBottom: 1,
  } as SxProps<Theme>,

  metadata: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexWrap: 'wrap',
  } as SxProps<Theme>,

  metadataItem: {
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: 500,
  } as SxProps<Theme>,

  statusChip: {
    fontWeight: 600,
    fontSize: '14px',
    height: 32,
    borderRadius: '16px',
    marginTop: '4px',
  } as SxProps<Theme>,

  tabsContainer: {
    paddingLeft: '24px',
    paddingRight: '24px',
  } as SxProps<Theme>,

  tabs: {
    minHeight: 40,
    '& .MuiTabs-indicator': {
      backgroundColor: '#1976D2',
      height: 2,
    },
    '& .MuiTabs-flexContainer': {
      gap: 2,
    },
  } as SxProps<Theme>,

  tab: {
    minHeight: 40,
    padding: '8px 16px',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    color: '#6B7280',
    '&.Mui-selected': {
      color: '#1976D2',
      fontWeight: 600,
    },
    '&:hover': {
      color: '#374151',
    },
  } as SxProps<Theme>,
};
