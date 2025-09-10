import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: theme.spacing(20.25), // 162px
  gap: 0,
}));

export const StyledCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.25, 1),
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: theme.spacing(18.875), // 151px
  marginTop: theme.spacing(-1),
  paddingTop: theme.spacing(1.25),
}));

export const StyledLabel = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.spacing(0.25),
  padding: theme.spacing(0.375, 0.5),
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
}));

export const ProgressTrack = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.spacing(20.25), // 162px
  height: theme.spacing(2.0625), // 16.5px
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.spacing(1.25),
  border: `1px solid ${theme.palette.action.hover}`,
  position: 'relative',
  overflow: 'hidden',
  marginTop: theme.spacing(0.25),
}));

export const LabelText = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.spacing(1), // 8px
  lineHeight: 1.25,
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  letterSpacing: 0,
}));

export const HeaderBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  gap: theme.spacing(1),
}));

export const IdentifierText = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.spacing(1.5), // 12px
  lineHeight: 1.67,
  color: theme.palette.text.primary,
  letterSpacing: 0,
}));

export const PercentageText = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.spacing(1.75), // 14px
  lineHeight: 1.43,
  color: theme.palette.text.primary,
  letterSpacing: 0,
}));


export const UtilizationBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: theme.spacing(0.5), // 4px
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.spacing(0.25),
  overflow: 'hidden',
  marginBottom: theme.spacing(1),
}));

export const UtilizationFill = styled(Box, {
  shouldForwardProp: (prop) => !['value'].includes(prop as string)
})<{ value: number }>(({ theme, value }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: `${Math.min(100, Math.max(0, value))}%`,
  background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
  transition: 'width 0.3s ease',
}));

export const ProgressFill = styled(Box, {
  shouldForwardProp: (prop) => !['value', 'progressColor'].includes(prop as string)
})<{ value: number; progressColor?: string }>(({ theme, value, progressColor }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: `${Math.min(100, Math.max(0, value))}%`,
  background: progressColor || `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.main} 100%)`,
  borderRadius: theme.spacing(1.25),
  transition: 'width 0.3s ease',
}));

export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5, 0),
  width: '100%',
}));

export const GridRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.625),
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: theme.spacing(1.125), // 9px
}));

export const GridDot = styled(Box, {
  shouldForwardProp: (prop) => !['statusColor'].includes(prop as string)
})<{ statusColor: string }>(({ theme, statusColor }) => ({
  width: theme.spacing(1.125), // 9px
  height: theme.spacing(1.125), // 9px
  borderRadius: '50%',
  backgroundColor: statusColor,
  flexShrink: 0,
  cursor: 'pointer',
  transition: theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'scale(1.2)',
  },
}));

export const FooterBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0.25, 0, 1, 0),
  gap: theme.spacing(1),
}));

export const FooterLabel = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.spacing(1.375), // 11px
  lineHeight: 1.82,
  color: theme.palette.text.primary,
  opacity: 0.5,
  letterSpacing: 0,
}));

export const FooterValue = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.spacing(1.375), // 11px
  lineHeight: 1.82,
  color: theme.palette.text.primary,
  letterSpacing: 0,
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.spacing(1.5), // 12px
  lineHeight: 1.67,
  color: theme.palette.text.secondary,
  backgroundColor: 'transparent',
  minWidth: theme.spacing(11.5), // 92px
  height: theme.spacing(4), // 32px
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:active': {
    backgroundColor: theme.palette.action.selected,
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.5),
    '& svg': {
      fontSize: theme.spacing(2), // 16px
    },
  },
}));