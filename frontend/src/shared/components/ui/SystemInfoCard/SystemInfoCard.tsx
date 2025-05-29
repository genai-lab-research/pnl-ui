import React from 'react';
import { Card, CardContent, Typography, Box, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

/**
 * Interface for setting items that have a name and value
 */
export interface SettingItem {
  /**
   * Name of the setting
   */
  name: string;
  
  /**
   * Value of the setting (string or React node)
   */
  value: string | React.ReactNode;
  
  /**
   * Whether the setting value is a link that opens in a new tab
   * @default false
   */
  isLink?: boolean;
  
  /**
   * URL for the link, required if isLink is true
   */
  linkUrl?: string;
  
  /**
   * Color for the link text
   * @default '#3545EE' (blue)
   */
  linkColor?: string;
}

/**
 * Interface for a setting group with a title and items
 */
export interface SettingGroup {
  /**
   * Title of the setting group
   */
  title: string;
  
  /**
   * List of settings in the group
   */
  items: SettingItem[];
}

/**
 * Props for the SystemInfoCard component
 */
export interface SystemInfoCardProps extends Omit<CardProps, 'title'> {
  /**
   * Title of the information card
   */
  title: string;
  
  /**
   * Optional subtitle/description for the card
   */
  subtitle?: string;
  
  /**
   * List of setting groups to display
   */
  groups: SettingGroup[];
  
  /**
   * Whether to remove the border from the card
   * @default false
   */
  noBorder?: boolean;
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'noBorder'
})<{ noBorder?: boolean }>(({ theme, noBorder }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  border: noBorder ? 'none' : `1px solid ${theme.palette.grey[300]}`,
  boxShadow: 'none',
  overflow: 'visible',
  
  // Responsive styles
  [theme.breakpoints.down('sm')]: {
    borderRadius: theme.shape.borderRadius / 1.5,
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2, 0, 2),
  marginBottom: theme.spacing(1),
  
  // Responsive styles
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 1.5, 0, 1.5),
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1, 2, 2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
  
  // Responsive styles
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1.5, 1.5),
    '&:last-child': {
      paddingBottom: theme.spacing(1.5),
    },
  },
}));

const GroupHeader = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  color: theme.palette.common.black,
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(1.5),
  
  '&:first-of-type': {
    marginTop: 0,
  },
  
  // Responsive styles
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
    lineHeight: '18px',
  },
}));

const StyledSettingRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
  
  // Responsive styles
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(0.25),
  },
}));

const SettingLabel = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: theme.palette.common.black,
  
  // Responsive styles
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
    lineHeight: '18px',
  },
}));

const SettingValue = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
  color: theme.palette.common.black,
  
  // Responsive styles
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
    lineHeight: '18px',
  },
}));

const LinkContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledOpenInNewIcon = styled(OpenInNewIcon)(({ theme }) => ({
  fontSize: '16px',
  marginLeft: theme.spacing(0.5),
}));

/**
 * SystemInfoCard component displays structured system information in a card format with groups of settings.
 * 
 * This component provides a consistent way to display configuration information, system settings,
 * or any other structured data that can be organized into groups with name/value pairs.
 * 
 * Features:
 * - Card with title and optional subtitle
 * - Multiple groups of settings
 * - Support for regular text values and link values with external link icon
 * - Fully responsive design with appropriate spacing on all screen sizes
 * - Customizable appearance through Material UI theming
 * 
 * @component
 * @example
 * ```tsx
 * <SystemInfoCard
 *   title="System Settings"
 *   subtitle="Create or deactivate a digital shadow for farm-container-04."
 *   groups={[
 *     {
 *       title: "Container Options",
 *       items: [
 *         { name: "Enable Shadow Service", value: "No" }
 *       ]
 *     },
 *     {
 *       title: "System Integration",
 *       items: [
 *         { name: "Connect to external systems", value: "Yes" },
 *         { 
 *           name: "FA Integration", 
 *           value: "Alpha", 
 *           isLink: true,
 *           linkUrl: "https://example.com/alpha" 
 *         }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export const SystemInfoCard: React.FC<SystemInfoCardProps> = ({
  title,
  subtitle,
  groups,
  noBorder = false,
  ...props
}) => {
  return (
    <StyledCard noBorder={noBorder} {...props}>
      <CardHeader>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700, 
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.15px',
            color: '#000000'
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              lineHeight: '17px',
              color: '#71717A',
              mt: 0.5
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardHeader>
      
      <StyledCardContent>
        {groups.map((group, groupIndex) => (
          <React.Fragment key={`group-${groupIndex}`}>
            <GroupHeader>
              {group.title}
            </GroupHeader>
            
            {group.items.map((item, itemIndex) => (
              <StyledSettingRow key={`setting-${groupIndex}-${itemIndex}`}>
                <SettingLabel>
                  {item.name}
                </SettingLabel>
                
                {item.isLink ? (
                  <LinkContainer 
                    component="a"
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SettingValue sx={{ color: item.linkColor || '#3545EE' }}>
                      {item.value}
                    </SettingValue>
                    <StyledOpenInNewIcon sx={{ color: item.linkColor || '#3545EE' }} />
                  </LinkContainer>
                ) : (
                  <SettingValue>
                    {item.value}
                  </SettingValue>
                )}
              </StyledSettingRow>
            ))}
          </React.Fragment>
        ))}
      </StyledCardContent>
    </StyledCard>
  );
};

export default SystemInfoCard;