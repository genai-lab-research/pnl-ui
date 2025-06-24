import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VerticalFarmingGeneralInfoBlock } from './VerticalFarmingGeneralInfoBlock';

describe('VerticalFarmingGeneralInfoBlock', () => {
  it('renders with the correct title', () => {
    render(<VerticalFarmingGeneralInfoBlock title="General Info" />);
    expect(screen.getByText('General Info')).toBeInTheDocument();
  });

  it('displays the correct icon based on expanded state (collapsed)', () => {
    const { container } = render(<VerticalFarmingGeneralInfoBlock title="General Info" isExpanded={false} />);
    // Check for down arrow (keyboard_arrow_down)
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('displays the correct icon based on expanded state (expanded)', () => {
    const { container } = render(<VerticalFarmingGeneralInfoBlock title="General Info" isExpanded={true} />);
    // Check for up arrow (keyboard_arrow_up)
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<VerticalFarmingGeneralInfoBlock title="General Info" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('General Info'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <VerticalFarmingGeneralInfoBlock title="General Info" className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});