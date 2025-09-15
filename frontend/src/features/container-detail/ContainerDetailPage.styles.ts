import { styled } from '@mui/material/styles';
import { Box, Grid } from '@mui/material';

/**
 * Styled components for ContainerDetailPage
 * Provides responsive design and consistent theming across the container detail interface
 * 
 * Note: styled-components warnings about unknown props like "variant" may come from 
 * existing atomic components - those should be fixed in their respective files by 
 * using transient props ($ prefix) or shouldForwardProp filters.
 */

// Main page container with full width design
export const StyledPageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fafafa',
  minHeight: '100vh',
  width: '100%',
  paddingTop: 0,
  paddingBottom: theme.spacing(4),
  
  // Responsive adjustments
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(3),
  },
  
  [theme.breakpoints.down('sm')]: {
    paddingBottom: theme.spacing(2),
  },
}));

// Full width sticky header section
export const StyledHeaderSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  width: '100%',
  borderBottom: '1px solid #e5e7eb',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 4),
  paddingBottom: 0,
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  
  // Responsive padding
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(2.5),
  },
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5, 2.5),
    marginBottom: theme.spacing(2),
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(1.5),
  },
}));

// Content section wrapper with max width constraint
export const StyledContentSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  padding: theme.spacing(3.5),
  marginBottom: theme.spacing(3),
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: '1440px',
  width: 'calc(100% - 64px)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  
  // Responsive padding
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2.5),
    width: 'calc(100% - 48px)',
  },
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
    borderRadius: '8px',
    width: 'calc(100% - 40px)',
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    borderRadius: '6px',
    width: 'calc(100% - 32px)',
  },
}));

// Metrics grid with responsive spacing
export const StyledMetricsGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  gap: theme.spacing(1.5),
  
  // Ensure proper spacing between grid items
  '& .MuiGrid-item': {
    display: 'flex',
    alignItems: 'stretch',
  },
  
  // Responsive adjustments
  [theme.breakpoints.down('lg')]: {
    marginBottom: theme.spacing(3),
    gap: theme.spacing(1.25),
  },
  
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(2.5),
    gap: theme.spacing(1),
  },
  
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
    gap: theme.spacing(0.75),
    
    // Stack metrics in rows of 2 on mobile
    '& .MuiGrid-item': {
      width: 'calc(50% - 8px)',
      maxWidth: 'calc(50% - 8px)',
      flexBasis: 'calc(50% - 8px)',
    },
  },
  
  // Extra small screens - single column
  [theme.breakpoints.down(480)]: {
    '& .MuiGrid-item': {
      width: '100%',
      maxWidth: '100%',
      flexBasis: '100%',
    },
  },
}));

// Tab navigation wrapper for full width layout
export const StyledTabNavigationWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1440px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 0,
  paddingTop: 0,
  
  '& .MuiTabs-root': {
    minHeight: '48px',
  },
  
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    color: '#6B7280',
    minHeight: '48px',
    padding: '12px 20px',
    
    '&:hover': {
      color: '#111827',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    
    '&.Mui-selected': {
      color: '#111827',
      fontWeight: 600,
    },
  },
  
  [theme.breakpoints.down('sm')]: {
    '& .MuiTab-root': {
      fontSize: '13px',
      padding: '10px 16px',
      minHeight: '44px',
    },
  },
}));

// Header row with full width layout
export const StyledHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  width: '100%',
  maxWidth: '1440px',
  marginLeft: 'auto',
  marginRight: 'auto',
  
  // Responsive layout adjustments
  [theme.breakpoints.down('md')]: {
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
  },
}));

// Title and status row with full width layout
export const StyledTitleStatusRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1.5),
  width: '100%',
  maxWidth: '1440px',
  marginLeft: 'auto',
  marginRight: 'auto',
  
  // Responsive adjustments
  [theme.breakpoints.down('md')]: {
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
  },
}));

// Responsive table container
export const StyledTableContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  
  // Ensure table scrolls horizontally on mobile
  [theme.breakpoints.down('md')]: {
    '& table': {
      minWidth: '600px',
    },
  },
  
  [theme.breakpoints.down('sm')]: {
    '& table': {
      minWidth: '500px',
    },
  },
}));

// Two-column layout with responsive behavior
export const StyledTwoColumnGrid = styled(Grid)(({ theme }) => ({
  // Default two-column layout
  '& .MuiGrid-item': {
    display: 'flex',
    flexDirection: 'column',
  },
  
  // Stack columns on tablet and mobile
  [theme.breakpoints.down('lg')]: {
    '& .MuiGrid-item': {
      width: '100%',
      maxWidth: '100%',
      flexBasis: '100%',
    },
  },
}));

// Activity timeline container
export const StyledActivityContainer = styled(Box)(({ theme }) => ({
  // Default styling for activity items
  '& > *': {
    marginBottom: theme.spacing(1),
  },
  
  '& > *:last-child': {
    marginBottom: 0,
  },
  
  // Responsive spacing adjustments
  [theme.breakpoints.down('sm')]: {
    '& > *': {
      marginBottom: theme.spacing(0.5),
    },
  },
}));

// Load more button styling
export const StyledLoadMoreButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: theme.spacing(1, 2),
  cursor: 'pointer',
  color: '#374151',
  fontSize: '14px',
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  transition: 'all 0.2s ease',
  
  '&:hover:not(:disabled)': {
    backgroundColor: '#f8fafc',
    borderColor: '#d1d5db',
  },
  
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  
  // Responsive sizing
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.75, 1.5),
    fontSize: '13px',
  },
}));

// Tab content placeholder styling
export const StyledTabPlaceholder = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  
  '& h5': {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
  },
  
  '& p': {
    color: theme.palette.text.secondary,
    maxWidth: '500px',
    margin: '0 auto',
  },
  
  // Responsive adjustments
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    
    '& h5': {
      fontSize: '1.25rem',
      marginBottom: theme.spacing(1),
    },
    
    '& p': {
      fontSize: '0.9rem',
    },
  },
}));

// Error alert styling
export const StyledErrorAlert = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  
  '& .MuiAlert-root': {
    borderRadius: theme.spacing(1),
  },
  
  // Responsive adjustments
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
    
    '& .MuiAlert-root': {
      borderRadius: theme.spacing(0.5),
      fontSize: '0.875rem',
    },
  },
}));

// Section header styling
export const StyledSectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(0.5),
  borderBottom: 'none',
  
  '& h5, & h6': {
    color: '#111827',
    fontWeight: 600,
    margin: 0,
    letterSpacing: '-0.01em',
  },
  
  // Responsive behavior
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(0.75),
  },
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    
    '& h5, & h6': {
      fontSize: '1.15rem',
    },
  },
}));

// Centered pagination container
export const StyledPaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  
  // Responsive adjustments
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(1.5),
  },
}));

// Responsive metrics card container
export const StyledMetricCardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  transition: 'box-shadow 0.2s ease',
  
  '&:hover': {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  
  // Icon styling
  '& .metric-icon': {
    color: '#9ca3af',
    fontSize: '20px',
    marginBottom: '8px',
  },
  
  // Title styling
  '& .metric-title': {
    fontSize: '12px',
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: '4px',
    lineHeight: 1.2,
  },
  
  // Value container
  '& .metric-value-container': {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  
  // Main value styling
  '& .metric-value': {
    fontSize: '24px',
    fontWeight: 600,
    color: '#111827',
    lineHeight: 1,
  },
  
  // Unit styling
  '& .metric-unit': {
    fontSize: '14px',
    fontWeight: 400,
    color: '#6b7280',
  },
  
  // Subtitle/target styling
  '& .metric-subtitle': {
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: '4px',
  },
  
  // Responsive adjustments
  [theme.breakpoints.down('md')]: {
    height: '110px',
    padding: '14px',
  },
  
  [theme.breakpoints.down('sm')]: {
    height: '100px',
    padding: '12px',
    
    '& .metric-value': {
      fontSize: '20px',
    },
  },
}));