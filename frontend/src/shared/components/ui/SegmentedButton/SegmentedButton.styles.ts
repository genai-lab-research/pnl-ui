import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

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