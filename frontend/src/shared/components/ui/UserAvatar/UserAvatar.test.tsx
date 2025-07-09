import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserAvatar from './UserAvatar';

describe('UserAvatar', () => {
  const defaultProps = {
    src: 'https://example.com/avatar.jpg',
    alt: 'User Avatar',
  };

  it('renders correctly with default props', () => {
    render(<UserAvatar {...defaultProps} />);
    
    const img = screen.getByAltText('User Avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('applies custom size', () => {
    render(<UserAvatar {...defaultProps} size={64} />);
    
    const img = screen.getByAltText('User Avatar');
    
    expect(img).toHaveStyle({
      width: '64px',
      height: '64px',
    });
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<UserAvatar {...defaultProps} onClick={onClick} />);
    
    const container = screen.getByAltText('User Avatar').parentElement;
    if (container) {
      fireEvent.click(container);
      expect(onClick).toHaveBeenCalledTimes(1);
    }
  });
});