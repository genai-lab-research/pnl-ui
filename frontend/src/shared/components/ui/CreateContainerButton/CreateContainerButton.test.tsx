import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateContainerButton } from './CreateContainerButton';

describe('CreateContainerButton', () => {
  test('renders the button with text', () => {
    render(<CreateContainerButton onClick={() => {}} />);
    const buttonElement = screen.getByText('Create Container');
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<CreateContainerButton onClick={handleClick} />);
    const buttonElement = screen.getByText('Create Container');
    
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('has disabled state when disabled prop is true', () => {
    render(<CreateContainerButton onClick={() => {}} disabled={true} />);
    const buttonElement = screen.getByText('Create Container');
    
    expect(buttonElement).toBeDisabled();
  });

  test('applies custom className when provided', () => {
    const customClass = 'custom-class';
    const { container } = render(
      <CreateContainerButton onClick={() => {}} className={customClass} />
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass(customClass);
  });
});