import { render, screen, fireEvent } from '@testing-library/react';
import { SearchFilters } from './SearchFilters';

describe('SearchFilters Component', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnTypeChange = jest.fn();
  const mockOnTenantChange = jest.fn();
  const mockOnPurposeChange = jest.fn();
  const mockOnStatusChange = jest.fn();
  const mockOnAlertsChange = jest.fn();
  const mockOnClearFilters = jest.fn();

  const defaultProps = {
    onSearchChange: mockOnSearchChange,
    onTypeChange: mockOnTypeChange,
    onTenantChange: mockOnTenantChange,
    onPurposeChange: mockOnPurposeChange,
    onStatusChange: mockOnStatusChange,
    onAlertsChange: mockOnAlertsChange,
    onClearFilters: mockOnClearFilters,
    searchValue: '',
    types: ['Container', 'Pod', 'Farm'],
    selectedType: 'All types',
    tenants: ['Tenant A', 'Tenant B'],
    selectedTenant: 'All tenants',
    purposes: ['Production', 'Research'],
    selectedPurpose: 'All purposes',
    statuses: ['Active', 'Inactive', 'Maintenance'],
    selectedStatus: 'All statuses',
    hasAlerts: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search field and filters', () => {
    render(<SearchFilters {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Search containers...')).toBeInTheDocument();
    expect(screen.getByText('All types')).toBeInTheDocument();
    expect(screen.getByText('All tenants')).toBeInTheDocument();
    expect(screen.getByText('All purposes')).toBeInTheDocument();
    expect(screen.getByText('All statuses')).toBeInTheDocument();
    expect(screen.getByText('Has Alerts')).toBeInTheDocument();
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  test('calls onSearchChange when search input changes', () => {
    render(<SearchFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search containers...') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(mockOnSearchChange).toHaveBeenCalledWith('test search');
  });

  test('calls onClearFilters when Clear Filters button is clicked', () => {
    render(<SearchFilters {...defaultProps} />);
    
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);
    
    expect(mockOnClearFilters).toHaveBeenCalled();
  });

  test('calls onAlertsChange when alert switch is toggled', () => {
    render(<SearchFilters {...defaultProps} />);
    
    const alertsSwitch = screen.getByRole('checkbox', { name: 'has alerts toggle' });
    fireEvent.click(alertsSwitch);
    
    expect(mockOnAlertsChange).toHaveBeenCalledWith(true);
  });
});