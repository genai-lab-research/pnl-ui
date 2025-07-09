import { render, screen } from '@testing-library/react';
import ContainerStatistics from './ContainerStatistics';

// Mock chart.js to prevent errors in test environment
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
}));

describe('ContainerStatistics', () => {
  const mockProps = {
    title: 'Physical Containers',
    containerCount: 4,
    yieldData: {
      average: 63,
      total: 81,
      dailyData: [70, 55, 65, 55, 72, 0, 0],
    },
    spaceUtilization: {
      average: 80,
      dailyData: [82, 75, 78, 73, 80, 0, 0],
    },
  };

  it('renders the component correctly', () => {
    render(<ContainerStatistics {...mockProps} />);
    
    // Check title and container count
    expect(screen.getByText('Physical Containers')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Check chart titles
    expect(screen.getByText('Yield')).toBeInTheDocument();
    expect(screen.getByText('Space Utilization')).toBeInTheDocument();
    
    // Check data values
    expect(screen.getByText('63KG')).toBeInTheDocument();
    expect(screen.getByText('81KG')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    
    // Check day labels
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dayLabels.forEach(day => {
      // Each day appears twice (once for each chart)
      const elements = screen.getAllByText(day);
      expect(elements.length).toBe(2);
    });
    
    // Check charts are rendered
    const charts = screen.getAllByTestId('mock-bar-chart');
    expect(charts.length).toBe(2);
  });
});