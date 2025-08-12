import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import styled from 'styled-components';

const FooterWrapper = styled(Box)`
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  background-color: #ffffff;
`;

const CreateButton = styled(Button)`
  width: 100%;
  height: 40px;
  background-color: #3545ee;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-transform: none;
  border-radius: 6px;
  
  &:hover {
    background-color: #2a3bc7;
  }
  
  &:disabled {
    background-color: rgba(53, 69, 238, 0.5);
    color: #fafafa;
  }
`;

interface CreateContainerFooterProps {
  label: string;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}

export const CreateContainerFooter: React.FC<CreateContainerFooterProps> = ({
  label,
  disabled,
  loading,
  onClick
}) => {
  return (
    <FooterWrapper>
      <CreateButton
        variant="contained"
        disabled={disabled || loading}
        onClick={onClick}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Creating...' : label}
      </CreateButton>
    </FooterWrapper>
  );
};