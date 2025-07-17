import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import { status, background, text, border } from '../../../styles/colors';

export type StatusType = 'Connected' | 'Maintenance' | 'Created' | 'Inactive';

export const getStatusColors = (statusType: StatusType) => {
  switch (statusType) {
    case 'Connected':
      return {
        backgroundColor: status.success,
        color: text.contrast,
        borderColor: status.successAlt,
      };
    case 'Maintenance':
      return {
        backgroundColor: status.warning,
        color: text.contrast,
        borderColor: status.warningAlt,
      };
    case 'Created':
      return {
        backgroundColor: background.secondary,
        color: text.tertiary,
        borderColor: border.primary,
      };
    case 'Inactive':
      return {
        backgroundColor: status.error,
        color: text.contrast,
        borderColor: status.errorAlt,
      };
    default:
      return {
        backgroundColor: background.secondary,
        color: text.tertiary,
        borderColor: border.primary,
      };
  }
};

export const StyledChip = styled(Chip)<{ statustype: StatusType }>(({ statustype }) => {
  const colors = getStatusColors(statustype);
  return {
    backgroundColor: colors.backgroundColor,
    color: colors.color,
    border: `1px solid ${colors.borderColor}`,
    borderRadius: '16px',
    height: '24px',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
    textTransform: 'capitalize',
    '& .MuiChip-label': {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  };
});