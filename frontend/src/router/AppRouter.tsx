import { Routes, Route, Navigate } from 'react-router-dom';
import { ContainerManagementDashboard } from '../features/container-dashboard/pages/ContainerManagementDashboard';
import { CreateContainerPage } from '../features/create-container/pages/CreateContainerPage';
import { EditContainerPage } from '../features/edit-container/pages/EditContainerPage';
import { ContainerDetailPage } from '../features/ContainerDetail';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ContainerManagementDashboard />} />
      <Route path="/containers/create" element={<CreateContainerPage />} />
      <Route path="/containers/:containerId/edit" element={<EditContainerPage />} />
      <Route path="/containers/:containerId" element={<ContainerDetailPage />} />
      <Route path="/containers/:containerId/:tab" element={<ContainerDetailPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};