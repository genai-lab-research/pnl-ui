import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Avatar } from './Avatar';

describe('Avatar Component', () => {
  const defaultProps = {
    src: 'https://example.com/avatar.jpg',
    alt: 'Test avatar',
  };

  it('renders correctly with required props', () => {
    render(<Avatar {...defaultProps} />);
    const imgElement = screen.getByAltText('Test avatar');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('applies className when provided', () => {
    render(<Avatar {...defaultProps} className="custom-class" />);
    const container = screen.getByAltText('Test avatar').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Avatar {...defaultProps} onClick={handleClick} />);
    const container = screen.getByAltText('Test avatar').parentElement;
    
    if (container) {
      fireEvent.click(container);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });
});