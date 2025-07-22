import { Crop } from '../../../../types/inventory';

export interface PanelBlockProps {
  panelId: string;
  wallNumber: number;
  slotNumber: number;
  utilization: number;
  cropCount: number;
  crops: Crop[];
  onClick?: () => void;
  onCropClick?: (crop: Crop) => void;
}

export interface CropVisualizationProps {
  crops: Crop[];
  channel: number;
  onCropClick?: (crop: Crop) => void;
}