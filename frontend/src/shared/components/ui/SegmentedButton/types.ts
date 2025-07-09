export interface SegmentedButtonOption {
  value: string;
  label: string;
}

export interface SegmentedButtonProps {
  options: SegmentedButtonOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}