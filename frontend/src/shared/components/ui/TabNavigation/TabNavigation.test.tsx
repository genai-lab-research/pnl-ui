import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabNavigation } from './TabNavigation';
import { TabNavigationProps } from './types';

describe('TabNavigation', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Overview' },
    { id: 'tab2', label: 'Environment & Recipes' },
    { id: 'tab3', label: 'Inventory' },
    { id: 'tab4', label: 'Devices' },
  ];

  const mockProps: TabNavigationProps = {
    tabs: mockTabs,
    activeTabId: 'tab1',
    onTabChange: jest.fn(),
  };

  it('renders all tabs correctly', () => {
    render(<TabNavigation {...mockProps} />);
    
    mockTabs.forEach(tab => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it('highlights the active tab', () => {
    render(<TabNavigation {...mockProps} />);
    
    const activeTab = screen.getByText('Overview');
    expect(activeTab).toHaveStyle({ color: '#3545EE' });

    const inactiveTab = screen.getByText('Environment & Recipes');
    expect(inactiveTab).not.toHaveStyle({ color: '#3545EE' });
  });

  it('calls onTabChange when clicking on a tab', () => {
    render(<TabNavigation {...mockProps} />);
    
    const tabToClick = screen.getByText('Inventory');
    fireEvent.click(tabToClick);
    
    expect(mockProps.onTabChange).toHaveBeenCalledWith('tab3');
  });
});
