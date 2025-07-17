import { styled } from '@mui/material/styles';
import { Drawer, TableContainer } from '@mui/material';
import { background, text, border, secondary, shadow, component } from '../../../styles/colors';

export const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ expanded }) => ({
  '& .MuiDrawer-paper': {
    width: expanded ? '100vw' : '400px',
    boxSizing: 'border-box',
    backgroundColor: background.primary,
    boxShadow: expanded ? 'none' : `-2px 0 8px ${shadow.light}`,
    transition: 'width 0.3s ease-in-out',
    zIndex: expanded ? 1300 : 1200, // Higher z-index when expanded to cover everything
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
  },
  '@keyframes typing': {
    '0%, 60%, 100%': {
      opacity: 0.3,
    },
    '30%': {
      opacity: 1,
    },
  },
}));

export const ChatContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ expanded }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: expanded ? background.secondary : background.primary,
  padding: expanded ? '0' : '16px',
}));

export const MessagesContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ expanded }) => ({
  flex: 1,
  overflow: 'auto',
  padding: expanded ? '24px' : '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxWidth: expanded ? '1200px' : '100%',
  margin: expanded ? '0 auto' : '0',
  width: '100%',
}));

export const MessageRow = styled('div')<{ type: 'user' | 'bot' }>(({ type }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  flexDirection: type === 'user' ? 'row-reverse' : 'row',
}));

export const MessageBubble = styled('div')<{ type: 'user' | 'bot' }>(({ type }) => ({
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: type === 'user' ? component.chatBubbleUser : component.chatBubbleBot,
  color: type === 'user' ? text.contrast : text.primary,
  fontSize: '14px',
  lineHeight: '20px',
}));

export const BotAvatar = styled('div')({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: border.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& img': {
    filter: 'none', // Ensure the icon displays in its original colors
  },
});

export const UserAvatar = styled('div')({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: secondary.main,
  color: secondary.contrast,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 500,
  flexShrink: 0,
});

export const TypingIndicator = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 12px',
});

export const TypingDot = styled('span')({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: component.avatarPlaceholder,
  animation: 'typing 1.4s infinite',
  '&:nth-of-type(2)': {
    animationDelay: '0.2s',
  },
  '&:nth-of-type(3)': {
    animationDelay: '0.4s',
  },
});

export const ChartImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '8px',
  marginTop: '12px',
  boxShadow: `0 2px 8px ${shadow.light}`,
});

export const StyledTableContainer = styled(TableContainer)({
  marginTop: '12px',
  borderRadius: '8px',
  boxShadow: `0 2px 8px ${shadow.light}`,
  '& .MuiTableHead-root': {
    backgroundColor: background.tertiary,
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: text.subtitle,
    borderBottom: `2px solid ${border.secondary}`,
  },
  '& .MuiTableCell-body': {
    color: text.light,
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: background.overlay,
  },
});

export const MessageInputContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ expanded }) => ({
  padding: expanded ? '24px' : '16px',
  maxWidth: expanded ? '1200px' : '100%',
  margin: expanded ? '0 auto' : '0',
  width: '100%',
}));