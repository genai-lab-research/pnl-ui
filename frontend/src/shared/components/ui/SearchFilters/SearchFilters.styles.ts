import styled from '@emotion/styled';
import { Box, TextField, Button, Switch } from '@mui/material';

export const SearchFiltersContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #FFFFFF;
  padding: 16px;
  box-shadow: 0px 0px 2px 0px rgba(65, 64, 69, 0.20);
`;

export const SearchField = styled(TextField)`
  min-width: 300px;
  .MuiOutlinedInput-root {
    border-radius: 4px;
  }
`;

export const FilterSelect = styled(TextField)`
  min-width: 120px;
`;

export const ClearFiltersButton = styled(Button)`
  white-space: nowrap;
`;

export const AlertsContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AlertsSwitch = styled(Switch)`
  &.MuiSwitch-root {
    margin-left: 8px;
  }
`;