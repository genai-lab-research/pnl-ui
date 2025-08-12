// Container Overview Feature Module
// Main entry point for the Container Overview feature

// Models
export * from './models';

// Services
export * from './services';

// ViewModels
export * from './viewmodels';

// Hooks
export * from './hooks';

// Domain logic exports for easier access
export {
  ContainerOverviewModel,
  DashboardMetricsModel,
  CropSummaryModel,
  ActivityLogModel,
  ContainerSettingsModel
} from './models';

export {
  ContainerOverviewViewModel,
  DashboardMetricsViewModel,
  CropSummaryViewModel,
  ActivityLogViewModel,
  SettingsViewModel
} from './viewmodels';

export {
  useContainerOverview,
  useDashboardMetrics,
  useCropSummary,
  useActivityLog,
  useContainerSettings
} from './hooks';

// API adapters for external use
export {
  containerOverviewApiAdapter,
  metricsApiAdapter,
  activityLogApiAdapter,
  settingsApiAdapter
} from './services';
