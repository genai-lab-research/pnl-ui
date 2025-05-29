import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ContainerDetailsPage from '../pages/ContainerDetailsPage';
import ContainerManagementDashboard from '../pages/ContainerManagementDashboard';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ContainerManagementDashboard />} />
        <Route path="/containers/:containerId" element={<ContainerDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;