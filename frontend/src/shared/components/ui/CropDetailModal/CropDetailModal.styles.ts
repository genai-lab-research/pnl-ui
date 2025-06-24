import { styled } from '@mui/material/styles';
import { Dialog, DialogContent, Box } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#F7F9FD',
    borderRadius: theme.spacing(1),
    maxWidth: '532px',
    width: '100%',
    maxHeight: '90vh',
    margin: theme.spacing(2),
  },
}));

export const StyledDialogContent = styled(DialogContent)(() => ({
  padding: 0,
  backgroundColor: '#FFFFFF',
  height: '100%',
  overflow: 'auto',
  '&:first-of-type': {
    paddingTop: 0,
  },
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #E0E0E0',
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

export const CropImageContainer = styled(Box)(() => ({
  width: '100%',
  height: '320px',
  backgroundColor: '#000000',
  position: 'relative',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

export const TimelineControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: '#FFFFFF',
}));


export const MetricsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#FFFFFF',
}));


export const AccordionSection = styled(Box)(({ theme }) => ({
  borderTop: '1px solid #E0E0E0',
  '& .MuiAccordion-root': {
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      margin: 0,
    },
  },
  '& .MuiAccordionSummary-root': {
    padding: theme.spacing(2, 3),
    minHeight: '56px',
    '&.Mui-expanded': {
      minHeight: '56px',
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(2, 3),
  },
}));

export const CloseButtonContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#FFFFFF',
  borderTop: '1px solid #E0E0E0',
  display: 'flex',
  justifyContent: 'center',
}));

