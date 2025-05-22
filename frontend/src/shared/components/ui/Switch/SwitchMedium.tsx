import React from "react";

export interface SwitchMediumProps {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  labelPlacement?: "start" | "end" | "top" | "bottom";
  className?: string;
}

export const SwitchMedium: React.FC<SwitchMediumProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  labelPlacement = "end",
  className = "",
  ...props
}) => {
  // Layout classes based on label placement
  const containerClasses = {
    start: "flex-row-reverse justify-end",
    end: "flex-row justify-start",
    top: "flex-col-reverse items-center",
    bottom: "flex-col items-center"
  };

  // Label margin classes based on placement
  const labelMarginClasses = {
    start: "mr-3",
    end: "ml-3",
    top: "mb-2",
    bottom: "mt-2"
  };

  // Switch component with Tailwind styling
  const Switch = () => (
    <div className="inline-block relative w-14 h-7">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <span
        className={`absolute inset-0 rounded-full transition duration-200 ease-in-out ${
          disabled ? "bg-gray-300" : checked ? "bg-primary-light" : "bg-gray-200"
        } peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-opacity-50`}
      ></span>
      <span
        className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-200 ${
          checked ? "translate-x-7 bg-primary" : ""
        } ${disabled ? "shadow-none" : "shadow-md"}`}
      ></span>
    </div>
  );

  // If there's no label, return just the switch
  if (!label) {
    return <Switch />;
  }

  // With label, create a flex container
  return (
    <label 
      className={`flex items-center ${containerClasses[labelPlacement]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <Switch />
      <span className={`text-sm ${labelMarginClasses[labelPlacement]} ${disabled ? "text-gray-400" : "text-text-primary"}`}>
        {label}
      </span>
    </label>
  );
};

export default SwitchMedium;