import React from "react";
import { IconButton, IconButtonProps } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

export interface CloseButtonProps extends Omit<IconButtonProps, "children"> {
  size?: "small" | "medium" | "large";
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const CloseButton: React.FC<CloseButtonProps> = ({
  size = "medium",
  ...props
}) => {
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
  };

  return (
    <StyledIconButton size={size} aria-label="close" {...props}>
      <CloseIcon style={{ fontSize: iconSize[size] }} />
    </StyledIconButton>
  );
};

export default CloseButton;