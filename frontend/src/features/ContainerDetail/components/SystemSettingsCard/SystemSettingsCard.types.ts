export interface SystemSettingsFormData {
  shadowServiceEnabled: boolean;
  roboticsSimulationEnabled: boolean;
  ecosystemConnected: boolean;
}

export interface SystemSettingsCardProps {
  formData: SystemSettingsFormData;
  isEditMode: boolean;
  onFieldChange: (field: string, value: boolean) => void;
}