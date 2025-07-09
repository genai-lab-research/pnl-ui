import * as React from 'react';
import { CreateContainerButtonProps } from './types';
import { Button, Container } from './CreateContainerButton.styles';

export const CreateContainerButton: React.FC<CreateContainerButtonProps> = ({
  onClick,
  className,
  disabled = false
}) => {
  return (
    <Container className={className}>
      <Button 
        onClick={onClick} 
        disabled={disabled}
        aria-label="Create Container"
      >
        Create Container
      </Button>
    </Container>
  );
};

export default CreateContainerButton;