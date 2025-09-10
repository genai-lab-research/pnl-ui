import { styled } from '@mui/material/styles';
import { Box, Typography, Alert, Skeleton } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
  gap: theme.spacing(0.5),
}));

export const TimelineWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  width: '100%',
  minHeight: 38,
  position: 'relative',
});

export const BlocksContainer = styled(Box)<{ gap: number }>(({ theme, gap }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: gap,
  flex: 1,
  height: 18,
  borderRadius: 6,
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    gap: Math.max(gap * 0.5, 2),
  },
}));

export const DayBlockStyled = styled(Box, {
  shouldForwardProp: (prop) => 
    !['isPast', 'isCurrent', 'isFuture', 'accentColor', 'baseColor', 'futureOpacity'].includes(prop as string)
})<{
  isPast?: boolean;
  isCurrent?: boolean;
  isFuture?: boolean;
  accentColor?: string;
  baseColor?: string;
  futureOpacity?: number;
}>(({ theme, isCurrent, isFuture, accentColor, baseColor, futureOpacity = 0.4 }) => ({
  height: '100%',
  flex: 1,
  minWidth: 2,
  borderRadius: 2,
  backgroundColor: isCurrent 
    ? accentColor || theme.palette.primary.main 
    : baseColor || theme.palette.grey[200],
  opacity: isFuture ? futureOpacity : 1,
  cursor: 'pointer',
  transition: theme.transitions.create(['transform', 'opacity'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'scaleY(1.2)',
    opacity: isFuture ? Math.min(futureOpacity + 0.1, 1) : 1,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 1,
  },
  [theme.breakpoints.down('sm')]: {
    '&:hover': {
      transform: 'scaleY(1.1)',
    },
  },
}));

export const DateLabel = styled(Typography)(({ theme }) => ({
  fontSize: 8,
  fontWeight: 500,
  lineHeight: '8px',
  color: theme.palette.text.primary,
  opacity: 0.5,
  textAlign: 'center',
  position: 'absolute',
  whiteSpace: 'nowrap',
  bottom: -12,
  [theme.breakpoints.down('sm')]: {
    fontSize: 7,
  },
}));

export const TooltipContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius / 2,
  padding: theme.spacing(0.75),
  boxShadow: theme.shadows[3],
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: -4,
    left: '50%',
    transform: 'translateX(-50%) rotate(45deg)',
    width: 8,
    height: 8,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.08)',
  },
}));

export const TooltipText = styled(Typography)(({ theme }) => ({
  fontSize: 10,
  fontWeight: 500,
  lineHeight: '10px',
  color: theme.palette.text.primary,
  [theme.breakpoints.down('sm')]: {
    fontSize: 9,
  },
}));

export const TooltipWrapper = styled(Box)({
  position: 'absolute',
  top: -28,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 10,
});

export const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
}));

export const ErrorAlert = styled(Alert)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  fontSize: '0.75rem',
  '& .MuiAlert-icon': {
    fontSize: '1rem',
  },
}));