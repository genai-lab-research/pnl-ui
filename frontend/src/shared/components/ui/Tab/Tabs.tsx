import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Tabs as MuiTabs, TabsProps as MuiTabsProps, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useIsMobile } from '../../../utils/responsive';

export interface CustomTabsProps {
  /**
   * The value of the currently selected tab.
   */
  value: number | string;
  
  /**
   * Callback fired when the value changes.
   */
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  
  /**
   * If `true`, the tabs will be centered.
   */
  centered?: boolean;
  
  /**
   * Custom color for the indicator.
   */
  customIndicatorColor?: string;
  
  /**
   * Custom width for the indicator.
   */
  indicatorWidth?: number;
  
  /**
   * If `true`, the tabs will be in a scrollable container.
   */
  scrollable?: boolean;
  
  /**
   * If `true`, will show scroll buttons when needed.
   */
  showScrollButtons?: boolean;
  
  /**
   * If `true`, tabs will have equal width in their container.
   */
  equalWidth?: boolean;
  
  /**
   * If `true`, the first tab will have rounded corners on the left side.
   */
  roundedFirstTab?: boolean;
  
  /**
   * If `true`, the last tab will have rounded corners on the right side.
   */
  roundedLastTab?: boolean;
  
  /**
   * Children should be Tab components.
   */
  children: React.ReactNode;
}

export type TabsProps = CustomTabsProps & Omit<MuiTabsProps, 'indicatorColor'>;

interface StyledTabsProps {
  customIndicatorColor?: string;
  indicatorWidth?: number;
  isMobile?: boolean;
  equalWidth?: boolean;
}

const StyledTabs = styled(MuiTabs, {
  shouldForwardProp: (prop) => 
    !['customIndicatorColor', 'indicatorWidth', 'isMobile', 'equalWidth'].includes(prop as string),
})<StyledTabsProps>(
  ({ theme, customIndicatorColor, indicatorWidth, isMobile, equalWidth }) => ({
    minHeight: 'auto',
    '& .MuiTabs-indicator': {
      backgroundColor: customIndicatorColor || '#3545EE',
      height: '2px', // Keep exact 2px height for indicator
      transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      ...(indicatorWidth && { 
        width: `${indicatorWidth}px !important`,
      }),
    },
    '& .MuiTabs-flexContainer': {
      gap: isMobile ? theme.spacing(0.5) : theme.spacing(1),
      // When equal width is desired, make tabs fill container
      ...(equalWidth && {
        width: '100%',
      }),
    },
    '& .MuiTabs-scroller': {
      overflow: 'auto !important', // Force overflow to be auto
      msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
      scrollbarWidth: 'none', // Hide scrollbar in Firefox
      '&::-webkit-scrollbar': { // Hide scrollbar in Chrome/Safari
        display: 'none',
      },
      // When equal width is desired, make tabs fill container
      ...(equalWidth && {
        width: '100%',
      }),
    }
  })
);

const ScrollContainer = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}));

const ScrollButton = styled(IconButton)(() => ({
  position: 'absolute',
  zIndex: 2,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  padding: 4,
  minWidth: 24,
  minHeight: 24,
}));

/**
 * Tabs component for organizing and allowing navigation between groups of content.
 * The component is responsive and provides scrollable behavior for many tabs.
 * 
 * @component
 * @example
 * ```tsx
 * const [value, setValue] = React.useState(0);
 * 
 * const handleChange = (event: React.SyntheticEvent, newValue: number) => {
 *   setValue(newValue);
 * };
 * 
 * return (
 *   <Tabs value={value} onChange={handleChange} equalWidth>
 *     <Tab label="Week" isFirst />
 *     <Tab label="Month" />
 *     <Tab label="Quarter" />
 *     <Tab label="Year" isLast />
 *   </Tabs>
 * );
 * ```
 */
export const Tabs: React.FC<TabsProps> = ({
  value,
  onChange,
  centered = false,
  customIndicatorColor = '#3545EE',
  indicatorWidth,
  scrollable = true,
  showScrollButtons = false,
  equalWidth = false,
  roundedFirstTab = true,
  roundedLastTab = true,
  children,
  ...props
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const isMobile = useIsMobile();

  // Detect if scroll buttons should be shown
  const checkScroll = useCallback(() => {
    if (tabsRef.current && showScrollButtons) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1); // -1 for rounding errors
    }
  }, [showScrollButtons]);

  // Handle scroll left
  const handleScrollLeft = useCallback(() => {
    if (tabsRef.current) {
      const scrollAmount = isMobile ? 150 : 300;
      tabsRef.current.scrollLeft -= scrollAmount;
    }
  }, [isMobile]);

  // Handle scroll right
  const handleScrollRight = useCallback(() => {
    if (tabsRef.current) {
      const scrollAmount = isMobile ? 150 : 300;
      tabsRef.current.scrollLeft += scrollAmount;
    }
  }, [isMobile]);

  // Scroll to the selected tab
  useEffect(() => {
    if (tabsRef.current && value !== undefined) {
      // Find the selected tab element
      const tabElements = tabsRef.current.querySelectorAll('[role="tab"]');
      const selectedTab = tabElements[typeof value === 'number' ? value : 0] as HTMLElement;
      
      if (selectedTab) {
        const { offsetLeft, offsetWidth } = selectedTab;
        const { scrollLeft, clientWidth } = tabsRef.current;
        
        // Only scroll if the tab is out of view
        if (offsetLeft < scrollLeft || offsetLeft + offsetWidth > scrollLeft + clientWidth) {
          const scrollPosition = offsetLeft - clientWidth / 2 + offsetWidth / 2;
          tabsRef.current.scrollLeft = Math.max(0, scrollPosition);
        }
      }
    }
  }, [value]);

  // Setup scroll event listener
  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      checkScroll();
      tabsElement.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        tabsElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [showScrollButtons, checkScroll]);

  // Add isFirst and isLast props to children to style rounded corners properly
  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      // Add isFirst prop to first tab and isLast prop to last tab
      const isFirst = index === 0 && roundedFirstTab;
      const isLast = index === React.Children.count(children) - 1 && roundedLastTab;
      
      return React.cloneElement(child, {
        isFirst,
        isLast,
        equalWidth,
        ...child.props,
      });
    }
    return child;
  });

  return (
    <ScrollContainer>
      {showScrollButtons && showLeftButton && (
        <ScrollButton 
          onClick={handleScrollLeft}
          sx={{ left: 0 }}
          size="small"
          aria-label="scroll tabs left"
        >
          <ChevronLeftIcon fontSize="small" />
        </ScrollButton>
      )}
      
      <TabContainer>
        <StyledTabs
          ref={tabsRef}
          value={value}
          onChange={onChange}
          centered={!scrollable && centered}
          variant={scrollable ? "scrollable" : "standard"}
          customIndicatorColor={customIndicatorColor}
          indicatorWidth={indicatorWidth}
          aria-label="tabs"
          scrollButtons={false} // We handle our own scroll buttons
          allowScrollButtonsMobile={false}
          isMobile={isMobile}
          equalWidth={equalWidth}
          sx={{ 
            width: '100%',
            overflow: 'auto',
            // Add a subtle shadow to indicate scroll
            ...(showRightButton && {
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                width: '24px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)',
                pointerEvents: 'none',
                zIndex: 1,
              },
            }),
            ...(showLeftButton && {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '24px',
                background: 'linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)',
                pointerEvents: 'none',
                zIndex: 1,
              },
            }),
          }}
          {...props}
        >
          {childrenWithProps}
        </StyledTabs>
      </TabContainer>

      {showScrollButtons && showRightButton && (
        <ScrollButton 
          onClick={handleScrollRight}
          sx={{ right: 0 }}
          size="small"
          aria-label="scroll tabs right"
        >
          <ChevronRightIcon fontSize="small" />
        </ScrollButton>
      )}
    </ScrollContainer>
  );
};

export default Tabs;