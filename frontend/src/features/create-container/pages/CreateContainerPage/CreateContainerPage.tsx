import React from 'react';
import { CreateContainerContainer } from '../../containers/CreateContainerContainer';
import { ContainerManagementDashboard } from '../../../container-dashboard/pages/ContainerManagementDashboard';
import { CreateContainerPageWrapper } from './CreateContainerPage.styles';

export const CreateContainerPage: React.FC = () => {
  return (
    <CreateContainerPageWrapper>
      <ContainerManagementDashboard />
      <CreateContainerContainer />
    </CreateContainerPageWrapper>
  );
};