import styled from 'styled-components';
import { Box, Typography } from '@mui/material';

export const SectionWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionTitle = styled(Typography)`
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0;
`;

export const InputGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FieldSpacing = styled(Box)`
  height: 0px;
`;

export const ToggleRow = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

