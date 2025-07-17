import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { colors } from '../../shared/styles';

export const DashboardContainer = styled(Box)({
  backgroundColor: colors.background.panel,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

export const ContentContainer = styled(Box)({
  flex: 1,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const PageTitle = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontSize: '32px',
  fontWeight: 700,
  color: colors.text.primary,
  marginBottom: '16px',
});

export const StatisticsSection = styled(Box)({
  display: 'flex',
  gap: '20px',
  marginBottom: '16px',
});

export const ContainerListSection = styled(Box)({
  backgroundColor: colors.background.primary,
  borderRadius: '8px',
  boxShadow: colors.shadow.card,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const ContainerListHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const ContainerListTitle = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontSize: '20px',
  fontWeight: 600,
  color: colors.text.primary,
});