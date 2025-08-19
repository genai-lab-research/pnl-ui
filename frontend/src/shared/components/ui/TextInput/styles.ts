import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { TextInputProps } from './types';

export const StyledTextInput = styled(TextField)<{ 
  inputsize?: TextInputProps['size'];
  inputvariant?: TextInputProps['variant'];
}>(({ theme, inputsize = 'md', inputvariant = 'default' }) => ({
  width: '100%',
  
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    backgroundColor: 'transparent',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.15px',
    
    // Size variants
    ...(inputsize === 'sm' && {
      padding: '6px 8px',
      fontSize: '12px',
      lineHeight: '20px',
    }),
    ...(inputsize === 'md' && {
      padding: '8px 12px',
      fontSize: '14px',
      lineHeight: '24px',
    }),
    ...(inputsize === 'lg' && {
      padding: '12px 16px',
      fontSize: '16px',
      lineHeight: '28px',
    }),
    
    '& fieldset': {
      borderColor: 'rgba(76, 78, 100, 0.22)',
      borderWidth: '1px',
    },
    
    '&:hover fieldset': {
      borderColor: 'rgba(76, 78, 100, 0.4)',
    },
    
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
    
    '&.Mui-error fieldset': {
      borderColor: theme.palette.error.main,
    },
    
    '&.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      
      '& fieldset': {
        borderColor: 'rgba(76, 78, 100, 0.12)',
      },
    },
  },
  
  '& .MuiOutlinedInput-input': {
    padding: 0,
    color: 'rgba(76, 78, 100, 0.87)',
    
    '&::placeholder': {
      color: 'rgba(76, 78, 100, 0.6)',
      opacity: 1,
    },
    
    '&.Mui-disabled': {
      color: 'rgba(76, 78, 100, 0.38)',
    },
  },
  
  '& .MuiInputLabel-root': {
    color: 'rgba(76, 78, 100, 0.6)',
    fontSize: '14px',
    fontWeight: 400,
    fontFamily: 'Roboto, sans-serif',
    
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
    
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
    
    '&.Mui-disabled': {
      color: 'rgba(76, 78, 100, 0.38)',
    },
  },
  
  '& .MuiFormHelperText-root': {
    margin: '4px 0 0 0',
    fontSize: '12px',
    fontFamily: 'Roboto, sans-serif',
    
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}));

export const CharCountContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '4px',
}));

export const CharCount = styled('span')<{ isNearLimit?: boolean; isOverLimit?: boolean }>(({ theme, isNearLimit, isOverLimit }) => ({
  fontSize: '12px',
  fontFamily: 'Roboto, sans-serif',
  color: isOverLimit ? theme.palette.error.main : isNearLimit ? theme.palette.warning.main : 'rgba(76, 78, 100, 0.6)',
}));

export const LoadingSkeleton = styled('div')(({ theme }) => ({
  width: '100%',
  height: '56px', // Default MUI TextField height
  borderRadius: '6px',
  backgroundColor: 'rgba(76, 78, 100, 0.08)',
  animation: 'pulse 1.5s ease-in-out infinite',
  
  '@keyframes pulse': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
    '100%': {
      opacity: 1,
    },
  },
}));
