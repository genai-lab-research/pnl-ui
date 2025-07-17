import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Box, Button, Avatar } from '@mui/material';
import { background, text, border, secondary } from '../../../styles/colors';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: background.primary,
  color: text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${border.secondary}`,
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

export const StyledToolbar = styled(Toolbar)({
  minHeight: '64px !important',
  paddingLeft: '24px',
  paddingRight: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const Logo = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '20px',
  fontWeight: 700,
  color: text.primary,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
});

export const UserSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const Talk2DBButton = styled(Button)({
  backgroundColor: secondary.main,
  color: secondary.contrast,
  textTransform: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  minWidth: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '&:hover': {
    backgroundColor: secondary.dark,
  },
});

export const StyledAvatar = styled(Avatar)({
  width: 32,
  height: 32,
  backgroundColor: secondary.main,
  fontSize: '14px',
  fontWeight: 500,
});