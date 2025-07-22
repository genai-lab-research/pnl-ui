export interface ContainerSettings {
  shadowServiceEnabled?: boolean;
  externalSystemsConnected?: boolean;
  faIntegration?: 'Alpha' | 'Beta' | 'Production';
  awsEnvironment?: 'Dev' | 'Staging' | 'Production';
  mbaiEnvironment?: 'Disabled' | 'Enabled' | 'Debug';
}

export interface ContainerSettingsPanelProps {
  /** Container settings object */
  settings: ContainerSettings;
  /** Callback when a setting is changed */
  onSettingChange?: (key: string, value: boolean | string) => void;
  /** Whether the settings are read-only */
  readOnly?: boolean;
  /** Panel title */
  title?: string;
  /** Additional styling props */
  sx?: object;
}