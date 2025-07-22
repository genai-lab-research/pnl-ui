export interface AddPanelBlockProps {
  wallNumber: number;
  slotNumber: number;
  onAddPanelClick: (wallNumber: number, slotNumber: number) => void;
}