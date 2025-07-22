import React from 'react';
import { 
  Container, 
  TopStack, 
  SlotBadge, 
  CardBody, 
  AddButton,
  ButtonText
} from './styles';
import { AddTrayBlockProps } from './types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

/**
 * AddTrayBlock Component
 * 
 * A vertical-farming control-panel card showing tray ID, progress (slot status),
 * and an "Add Tray" primary action button.
 */
export const AddTrayBlock: React.FC<AddTrayBlockProps> = ({ 
  slotNumber = 5,
  onAddTrayClick,
  className 
}) => {
  const handleAddTrayClick = () => {
    if (onAddTrayClick) {
      onAddTrayClick();
    }
  };

  return (
    <Container className={className}>
      <TopStack>
        <SlotBadge>SLOT {slotNumber}</SlotBadge>
      </TopStack>
      
      <CardBody>
        <AddButton onClick={handleAddTrayClick}>
          <AddCircleOutlineIcon fontSize="small" />
          <ButtonText>Add Tray</ButtonText>
        </AddButton>
      </CardBody>
    </Container>
  );
};