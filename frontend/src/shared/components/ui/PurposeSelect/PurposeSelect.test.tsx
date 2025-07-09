import { render, screen } from '@testing-library/react';
import PurposeSelect from './PurposeSelect';

describe('PurposeSelect', () => {
  it('renders with default placeholder', () => {
    render(<PurposeSelect />);
    expect(screen.getByText('Purpose')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<PurposeSelect placeholder="Select purpose" />);
    expect(screen.getByText('Select purpose')).toBeInTheDocument();
  });

  it('renders with provided value', () => {
    render(<PurposeSelect value="Research" />);
    expect(screen.getByText('Research')).toBeInTheDocument();
  });

  it('renders dropdown icon', () => {
    render(<PurposeSelect />);
    // Check if the arrow icon is rendered
    const arrowContainer = document.querySelector('svg');
    expect(arrowContainer).toBeInTheDocument();
  });

  it('has correct width when provided', () => {
    render(<PurposeSelect width={400} />);
    const container = document.querySelector('div');
    expect(container).toHaveStyle('width: 400px');
  });

  it('has default width when not provided', () => {
    render(<PurposeSelect />);
    const container = document.querySelector('div');
    expect(container).toHaveStyle('width: 372px');
  });
});
