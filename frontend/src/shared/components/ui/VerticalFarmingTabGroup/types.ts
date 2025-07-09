export interface TabOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface VerticalFarmingTabGroupProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
}
