# ViewToggleTabs Implementation Summary

## Component Description
The ViewToggleTabs component provides a simple way to toggle between list view and grid view modes. It consists of two icon buttons that represent different view modes, styled according to the reference design.

## Features
- Toggle between list and grid view modes
- Visual indication of active view mode
- Customizable colors for active/inactive states
- Responsive design that adapts to different screen sizes
- Keyboard accessible and screen reader friendly
- Seamless integration with existing tab components

## Implementation Details
- Extended the existing Tab component for consistent behavior
- Created a specialized IconTab styled component for icon-only tabs
- Used Material UI icons for list and grid views
- Added responsive behavior using the useIsMobile hook
- Implemented proper accessibility attributes for screen readers
- Added customization options for colors through props

## API
```tsx
interface ViewToggleTabsProps {
  /**
   * The currently selected view mode ('list' | 'grid')
   */
  value: ViewMode;
  
  /**
   * Callback fired when the view mode changes
   */
  onChange: (event: React.SyntheticEvent, newValue: ViewMode) => void;
  
  /**
   * Custom color for the active tab background (default: '#455168')
   */
  activeBackgroundColor?: string;
  
  /**
   * Custom color for the active icon (default: '#FFFFFF')
   */
  activeIconColor?: string;
  
  /**
   * Custom color for the inactive icon (default: '#455168')
   */
  inactiveIconColor?: string;
  
  /**
   * Custom class name applied to the root element
   */
  className?: string;
}
```

## Usage Example
```tsx
const [viewMode, setViewMode] = useState<ViewMode>('list');

const handleViewChange = (event, newMode) => {
  setViewMode(newMode);
};

return (
  <ViewToggleTabs
    value={viewMode}
    onChange={handleViewChange}
  />
);
```

## Screenshots
- See Storybook stories for visual examples
- Default implementation matches the reference design exactly
- Custom color examples showcase flexibility

## Accessibility Considerations
- Icon buttons include aria-label attributes for screen readers
- Focus states are properly styled
- Keyboard navigation is supported

## Browser Support
- Tested and compatible with modern browsers
- Responsive behavior works across all viewport sizes