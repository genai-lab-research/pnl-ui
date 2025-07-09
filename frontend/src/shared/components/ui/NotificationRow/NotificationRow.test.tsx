import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationRow from './NotificationRow';

describe('NotificationRow', () => {
  const defaultProps = {
    message: 'Environment mode switched to Auto',
    timestamp: 'April 10, 2025 – 10:00PM',
    authorName: 'Markus Johnson',
  };

  it('renders with all required props', () => {
    render(<NotificationRow {...defaultProps} />);
    
    expect(screen.getByText('Environment mode switched to Auto')).toBeInTheDocument();
    expect(screen.getByText('April 10, 2025 – 10:00PM')).toBeInTheDocument();
    expect(screen.getByText('Markus Johnson')).toBeInTheDocument();
  });

  it('renders avatar icon when no avatarUrl is provided', () => {
    render(<NotificationRow {...defaultProps} />);
    
    const avatarContainer = screen.getByText('Environment mode switched to Auto').parentElement?.parentElement;
    expect(avatarContainer?.firstChild).toBeInTheDocument();
  });

  it('renders avatar image when avatarUrl is provided', () => {
    const propsWithAvatar = {
      ...defaultProps,
      avatarUrl: 'https://example.com/avatar.jpg',
    };
    
    render(<NotificationRow {...propsWithAvatar} />);
    
    const avatarImg = screen.getByAltText('Markus Johnson');
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });
});