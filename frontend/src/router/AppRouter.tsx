import { Routes, Route, Navigate } from 'react-router-dom';
import ContainerManagementDashboardPage from '../features/ContainerManagement/ContainerManagementDashboardPage';
import ContainerDetailPage from '../features/ContainerDetail/ContainerDetailPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ContainerManagementDashboardPage />} />
      <Route path="/containers/:containerId" element={<ContainerDetailPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};