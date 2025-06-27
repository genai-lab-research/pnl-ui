import styled from '@emotion/styled';
import { Box, TextField, Button, Switch } from '@mui/material';
import { fonts } from '@/shared/constants/fonts'

export const SearchFiltersContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: white;
`;

export const SearchField = styled(TextField)`
  min-width: 300px;
  .MuiOutlinedInput-root {
    border-radius: 6px;
  }
`;

export const FilterSelect = styled(TextField)`
  min-width: 120px;
`;

export const ClearFiltersButton = styled(Button)({
  backgroundColor: '#EFF0F3',    
  color: 'black',              
  borderRadius: '6px',
  padding: '8px 16px',
  fontFamily: fonts.heading,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  textTransform: 'none',
  whiteSpace: 'nowrap',

  '&:hover': {
    backgroundColor: '#E9EBEE',
  },
});


export const AlertsContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

export const AlertsSwitch = styled(Switch)`
  &.MuiSwitch-root {
    margin-left: 8px;
  }
`;