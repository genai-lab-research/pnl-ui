import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditContainerContainer } from '../../containers/EditContainerContainer';
import { StyledPageContainer } from './EditContainerPage.styles';

export interface EditContainerPageProps {
  containerId?: number;
  open?: boolean;
  onClose?: () => void;
}

export const EditContainerPage: React.FC<EditContainerPageProps> = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  
  // Get containerId from props or route params
  const containerId = props.containerId || (params.containerId ? parseInt(params.containerId, 10) : null);
  
  // Default to open if used as a page component
  const open = props.open !== undefined ? props.open : true;
  
  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    } else {
      // Navigate back if used as a page route
      navigate(-1);
    }
  };

  if (!containerId || isNaN(containerId)) {
    return (
      <StyledPageContainer>
        <div>Invalid container ID</div>
      </StyledPageContainer>
    );
  }

  return (
    <StyledPageContainer>
      <EditContainerContainer
        containerId={containerId}
        open={open}
        onClose={handleClose}
      />
    </StyledPageContainer>
  );
};

export default EditContainerPage;