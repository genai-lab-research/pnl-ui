import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import { background, border, interactive, text } from '../../../styles/colors';

export const StyledAddPanelBlock = styled(Box)(() => ({
  backgroundColor: background.overlay,
  border: `2px dashed ${border.secondary}`,
  borderRadius: '8px',
  padding: '16px',
  width: '100%',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: interactive.active,
    backgroundColor: background.tertiary,
    '& .MuiIconButton-root': {
      backgroundColor: border.secondary,
    },
  },
}));

export const AddButton = styled(IconButton)(() => ({
  backgroundColor: background.tertiary,
  width: '64px',
  height: '64px',
  marginBottom: '16px',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: border.secondary,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '32px',
    color: text.muted,
  },
}));