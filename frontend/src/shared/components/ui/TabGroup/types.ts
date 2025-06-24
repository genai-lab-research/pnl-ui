export interface TabOption {
  value: string;
  label: string;
}

export interface TabGroupProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
}
