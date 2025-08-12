/** @jsxImportSource @emotion/react */
import React from 'react';
import { errorStyles } from '../styles';

export interface ErrorMessageProps {
  error: string;
  className?: string;
}

/**
 * Error message component for SegmentedControl
 * Provides accessible error feedback to users
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  className = '',
}) => {
  if (!error) return null;

  return (
    <div 
      css={errorStyles} 
      className={className}
      role="alert" 
      aria-live="polite"
      id="segmented-control-error"
    >
      {error}
    </div>
  );
};

export default ErrorMessage;