import { styled } from '@mui/material/styles';
import { Drawer, Box } from '@mui/material';

export const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    border: '1px solid #E0E0E0',
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  }
}));

export const StyledDrawerHeader = styled(Box)(() => ({
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  borderBottom: '1px solid #E0E0E0',
  minHeight: 72,
  position: 'relative',
  
  '& .MuiTypography-root': {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '22px',
    fontWeight: 600,
    color: '#000000',
    margin: '0 auto',
    textAlign: 'center'
  },
  
  '& .MuiIconButton-root': {
    position: 'absolute',
    top: 20,
    left: 24,
    zIndex: 1
  }
}));

export const StyledDrawerContent = styled(Box)(() => ({
  flex: 1,
  padding: '0 24px',
  paddingTop: 24,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  
  '& .section-title': {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: 700,
    color: '#000000',
    marginBottom: 16
  },
  
  '& .field-stack': {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  }
}));

export const StyledSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  
  '& .section-header': {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: 700,
    color: '#000000',
    marginBottom: 16
  }
}));

export const StyledFieldRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  
  '& .field-label': {
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    color: '#4C4E64',
    marginBottom: 4
  }
}));

export const StyledSegmentedButton = styled(Box)(() => ({
  display: 'flex',
  border: '1px solid #455168',
  borderRadius: 4,
  overflow: 'hidden',
  
  '& .segment': {
    flex: 1,
    padding: '8px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    transition: 'all 0.2s ease',
    border: 'none',
    background: 'transparent',
    
    '&.active': {
      backgroundColor: '#455168',
      color: '#FFFFFF'
    },
    
    '&.inactive': {
      backgroundColor: 'transparent',
      color: '#4C4E64',
      borderRight: '1px solid #6D788D'
    },
    
    '&:last-child': {
      borderRight: 'none'
    },
    
    '&:disabled': {
      backgroundColor: 'rgba(76, 78, 100, 0.12)',
      color: 'rgba(76, 78, 100, 0.4)',
      cursor: 'not-allowed'
    }
  }
}));

export const StyledFooter = styled(Box)(() => ({
  padding: '16px 24px 20px',
  borderTop: '1px solid #E0E0E0',
  display: 'flex',
  gap: 16,
  backgroundColor: '#FFFFFF',
  
  '& .MuiButton-root': {
    flex: 1,
    height: 40,
    textTransform: 'none',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: 6
  },
  
  '& .MuiButton-contained': {
    backgroundColor: '#3545EE',
    color: '#FAFAFA',
    
    '&:hover': {
      backgroundColor: '#2A3ADB'
    },
    
    '&:disabled': {
      backgroundColor: 'rgba(76, 78, 100, 0.12)',
      color: 'rgba(76, 78, 100, 0.4)'
    }
  },
  
  '& .MuiButton-outlined': {
    borderColor: '#4C4E64',
    color: '#4C4E64',
    
    '&:hover': {
      borderColor: '#3A3C52',
      backgroundColor: 'rgba(76, 78, 100, 0.04)'
    }
  }
}));