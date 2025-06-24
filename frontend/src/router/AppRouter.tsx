import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ContainerManagement } from '../features/ContainerManagement';
import { ContainerCreationDemo } from '../features/ContainerCreation';
import { ContainerOverview } from '../features/ContainerOverview';
import { ContainerInventory } from '../features/ContainerInventory';
import { CropDetailView } from '../features/ContainerInventory/components/CropDetailView';
import { Page3 } from '../pages/Page3';
import { 
  TimeRangeSelectorDemo, 
  PaginatorDemo, 
  SearchFiltersDemo, 
  CheckboxDemo, 
  SwitchDemo,
  PurposeSelectDemo,
  SegmentedButtonDemo,
  DataGridRowDemo,
  YieldBlockDemo,
  TemperatureDisplayDemo,
  UserAvatarDemo,
  NavigationLinkDemo,
  AddTrayBlockDemo,
  VerticalFarmingGenerationTimelineBlockDemo
  // GenerationBlockDemo
} from '../features/example';

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
        <Route path="/demo/time-range" element={<TimeRangeSelectorDemo />} />
        <Route path="/demo/paginator" element={<PaginatorDemo />} />
        <Route path="/demo/filters" element={<SearchFiltersDemo />} />
        <Route path="/demo/checkbox" element={<CheckboxDemo />} />
        <Route path="/demo/switch" element={<SwitchDemo />} />
        <Route path="/demo/purpose-select" element={<PurposeSelectDemo />} />
        <Route path="/demo/segmented-button" element={<SegmentedButtonDemo />} />
        <Route path="/demo/data-grid-row" element={<DataGridRowDemo />} />
        <Route path="/demo/yield-block" element={<YieldBlockDemo />} />
        <Route path="/demo/temperature-display" element={<TemperatureDisplayDemo />} />
        <Route path="/demo/user-avatar" element={<UserAvatarDemo />} />
        <Route path="/demo/navigation-link" element={<NavigationLinkDemo />} />
        <Route path="/demo/add-tray-block" element={<AddTrayBlockDemo />} />
        <Route path="/demo/generation-timeline" element={<VerticalFarmingGenerationTimelineBlockDemo />} />
        {/* <Route path="/demo/generation-block" element={<GenerationBlockDemo />} /> */}
        <Route path="*" element={<Navigate to="/containers" replace />} />
      </Routes>
    </Router>
  );
};