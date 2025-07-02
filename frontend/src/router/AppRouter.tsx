import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ContainerManagement } from '../features/ContainerManagement';
import { ContainerCreationDemo } from '../features/ContainerCreation';
import { ContainerOverview } from '../features/ContainerOverview';
import { ContainerInventory } from '../features/ContainerInventory';
import { CropDetailView } from '../features/ContainerInventory/components/CropDetailView';
import { Page3 } from '../pages/Page3';


export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/containers" replace />} />
        <Route path="/containers" element={<ContainerManagement />} />
        <Route path="/containers/:containerId" element={<ContainerOverview />} />
        <Route path="/containers/:containerId/inventory" element={<ContainerInventory />} />
        <Route path="/containers/:containerId/inventory/crop/:cropId" element={<CropDetailView />} />
        <Route path="/containers/create" element={<ContainerCreationDemo />} />
        <Route path="/page3" element={<Page3 />} />
        {/* <Route path="/demo/generation-block" element={<GenerationBlockDemo />} /> */}
        <Route path="*" element={<Navigate to="/containers" replace />} />
      </Routes>
    </Router>
  );
};