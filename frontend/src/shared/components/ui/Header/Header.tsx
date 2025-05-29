import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'; // Container icon
import { useIsXs } from '../../../utils/responsive';
import Avatar from '../Avatar/Avatar';
import { Tab } from '../Tab/Tab';
import { Tabs } from '../Tab/Tabs';
import Chip from '../Chip/Chip';

export interface HeaderTab {
  label: string;
  value: number | string;
  disabled?: boolean;
  badge?: number;
}

export interface HeaderProps {
  /**
   * Breadcrumb text for the header (e.g., "Container Dashboard / farm-container-04")
   */
  breadcrumb?: string;

  /**
   * Main title text for the header (e.g., "farm-container-04")
   */
  title: string;

  /**
   * Additional metadata text to display (e.g., "Physical container | Tenant-123 | Development")
   */
  metadata?: string;

  /**
   * Status of the container to be displayed as a chip
   */
  status?: 'active' | 'inactive' | 'in-progress';

  /**
   * Avatar source URL (optional)
   */
  avatarSrc?: string;

  /**
   * Array of tab objects for the navigation tabs
   */
  tabs: HeaderTab[];

  /**
   * Currently selected tab value
   */
  selectedTab: number | string;

  /**
   * Callback function when a tab is selected
   */
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;

  /**
   * Callback function for back button click
   */
  onBackClick?: () => void;
}

const HeaderContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #E5E7EB',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  
  // Responsive padding
  padding: theme.spacing(2),
  paddingBottom: 0,
  
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2, 3),
    paddingBottom: 0
  },
  
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2, 4),
    paddingBottom: 0
  },
}));

const TopSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: theme.spacing(1),
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
}));

const BreadcrumbSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const BreadcrumbText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '28px',
  color: '#000000',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  
  [theme.breakpoints.down('md')]: {
    maxWidth: '300px',
  },
  
  [theme.breakpoints.down('sm')]: {
    maxWidth: '250px',
    fontSize: '13px',
    lineHeight: '24px',
  },
}));

const TitleSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: theme.spacing(0.5),
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  fontSize: '30px',
  lineHeight: '36px',
  color: '#000000',
  letterSpacing: '-0.75px',
  
  [theme.breakpoints.down('md')]: {
    fontSize: '26px',
    lineHeight: '32px',
  },
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '22px',
    lineHeight: '28px',
  },
}));

const MetadataContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const MetadataText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '16.94px',
  color: '#71717A',
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
    lineHeight: '16px',
  },
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  
  [theme.breakpoints.down('sm')]: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  overflow: 'auto',
  
  // Hide scrollbar but keep functionality
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
}));

const IconContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});

const StatusChipContainer = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(0.5),
  },
}));

/**
 * Header component for container dashboard based on Figma design
 * 
 * Displays container information with navigation elements and tabs
 * Fully responsive across all screen sizes
 * 
 * @component
 * @example
 * ```tsx
 * const tabs = [
 *   { label: 'Overview', value: 0 },
 *   { label: 'Inspection (3D tour)', value: 1 },
 *   { label: 'Environment & Recipes', value: 2 }
 * ];
 * 
 * const [selectedTab, setSelectedTab] = useState(0);
 * 
 * const handleTabChange = (event, newValue) => {
 *   setSelectedTab(newValue);
 * };
 * 
 * <Header 
 *   breadcrumb="Container Dashboard / farm-container-04"
 *   title="farm-container-04"
 *   metadata="Physical container | Tenant-123 | Development"
 *   status="active"
 *   avatarSrc="/path/to/avatar.jpg"
 *   tabs={tabs}
 *   selectedTab={selectedTab}
 *   onTabChange={handleTabChange}
 *   onBackClick={() => navigate(-1)}
 * />
 * ```
 */
const Header: React.FC<HeaderProps> = ({
  breadcrumb,
  title,
  metadata,
  status = 'active',
  avatarSrc,
  tabs,
  selectedTab,
  onTabChange,
  onBackClick,
}) => {
  const isExtraSmall = useIsXs();
  
  // Determine which tab value should be selected
  const currentTabValue = selectedTab;
  
  return (
    <HeaderContainer>
      <TopSection>
        {/* Left Section: Breadcrumb Navigation */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, position: 'relative', width: '100%' }}>
          {breadcrumb && (
            <BreadcrumbSection>
              <IconButton 
                onClick={onBackClick} 
                size="small" 
                sx={{ p: 0.5 }}
                aria-label="back"
              >
                <ArrowBackIcon />
              </IconButton>
              <BreadcrumbText>
                {breadcrumb}
              </BreadcrumbText>
            </BreadcrumbSection>
          )}

          {/* Title and Metadata */}
          <TitleSection>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HeaderTitle>{title}</HeaderTitle>
            </Box>
            {metadata && (
              <MetadataContainer>
                <IconContainer>
                  <LocalShippingOutlinedIcon sx={{ fontSize: 20, color: '#71717A' }} />
                </IconContainer>
              <MetadataText>{metadata}</MetadataText>
              {status && (
                <StatusChipContainer>
                  <Chip 
                    value={status === 'active' ? 'Active' : status === 'in-progress' ? 'In Progress' : 'Inactive'} 
                    status={status}
                    size="small"
                  />
                </StatusChipContainer>
              )}
              </MetadataContainer>
            )}
          </TitleSection>
        </Box>
        
        {/* Right Section: Avatar */}
        {avatarSrc && (
          <AvatarContainer>
            <Avatar src={avatarSrc} size={isExtraSmall ? 'small' : 'medium'} />
          </AvatarContainer>
        )}
      </TopSection>
      
      {/* Tabs Navigation */}
      {tabs.length > 0 && (
        <TabsContainer>
          <Tabs 
            value={currentTabValue} 
            onChange={onTabChange}
            aria-label="container navigation tabs"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                disabled={tab.disabled}
                showBadge={!!tab.badge}
                badgeContent={tab.badge}
              />
            ))}
          </Tabs>
        </TabsContainer>
      )}
    </HeaderContainer>
  );
};

export default Header;