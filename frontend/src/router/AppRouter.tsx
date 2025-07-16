import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ContainerDashboardPage } from '../features/ContainerDashboard';
import { AuthDemo } from '../components/AuthDemo';
import { useAuth } from '../context/AuthContext.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/containers" element={
          <ProtectedRoute>
            <ContainerDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/containers" replace />} />
      </Routes>
    </Router>
  );
};