export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
  id?: string;
  name?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  'aria-label'?: string;
}