import React from "react";
import { Chip, ChipProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

export type StatusChipVariant = "active" | "inactive" | "maintenance" | "error" | "warning";

export interface StatusChipSmallProps extends Omit<ChipProps, "variant"> {
  status?: StatusChipVariant;
}

const getStatusColor = (status: StatusChipVariant) => {
  switch (status) {
    case "active":
      return "#47a067"; // Green
    case "inactive":
      return "#9e9e9e"; // Gray
    case "maintenance":
      return "#f59e0b"; // Amber
    case "error":
      return "#ef4444"; // Red
    case "warning":
      return "#f59e0b"; // Amber
    default:
      return "#9e9e9e"; // Default gray
  }
};

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "statusColor",
})<{ statusColor: string }>(({ theme, statusColor }) => ({
  height: 22,
  borderRadius: 9999,
  backgroundColor: statusColor,
  color: "#ffffff",
  fontWeight: 600,
  fontSize: "0.75rem",
  "& .MuiChip-label": {
    padding: '3px 11px',
  },
  "&:hover": {
    backgroundColor: alpha(statusColor, 0.9),
  },
}));

export const StatusChipSmall: React.FC<StatusChipSmallProps> = ({
  status = "active",
  label,
  ...props
}) => {
  const statusColor = getStatusColor(status);
  const chipLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <StyledChip
      label={chipLabel}
      statusColor={statusColor}
      {...props}
    />
  );
};

export default StatusChipSmall;