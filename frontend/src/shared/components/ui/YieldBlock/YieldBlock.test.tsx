import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { YieldBlock } from './YieldBlock';

describe('YieldBlock', () => {
  it('renders with default label', () => {
    render(<YieldBlock value="51KG" increment="+1.5Kg" />);
    
    expect(screen.getByText('Yield')).toBeInTheDocument();
    expect(screen.getByText('51KG')).toBeInTheDocument();
    expect(screen.getByText('+1.5Kg')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<YieldBlock label="Custom Label" value="51KG" increment="+1.5Kg" />);
    
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
    expect(screen.getByText('51KG')).toBeInTheDocument();
    expect(screen.getByText('+1.5Kg')).toBeInTheDocument();
  });

  it('renders without increment', () => {
    render(<YieldBlock value="51KG" />);
    
    expect(screen.getByText('Yield')).toBeInTheDocument();
    expect(screen.getByText('51KG')).toBeInTheDocument();
    expect(screen.queryByText('+1.5Kg')).not.toBeInTheDocument();
  });

  it('applies additional className', () => {
    const { container } = render(<YieldBlock value="51KG" className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});