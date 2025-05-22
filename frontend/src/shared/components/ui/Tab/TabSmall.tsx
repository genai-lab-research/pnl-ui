import React from "react";
import { Button, ButtonProps, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface TabSmallProps extends Omit<ButtonProps, "variant"> {
  active?: boolean;
  badgeContent?: React.ReactNode;
  showBadge?: boolean;
}

const StyledTab = styled(Button, {
  shouldForwardProp: (prop) => !['active', 'showBadge'].includes(String(prop)),
})<{ active?: boolean; showBadge?: boolean }>(({ theme, active }) => ({
  textTransform: "none",
  minWidth: 83,
  height: 40,
  padding: theme.spacing(1.75, 1.5),
  borderRadius: 0,
  position: 'relative',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: "transparent",
  boxShadow: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  letterSpacing: "0.1px",
  lineHeight: "20px",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: active ? theme.palette.primary.main : "transparent",
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const TabSmall: React.FC<TabSmallProps> = ({
  children,
  active = false,
  disabled = false,
  badgeContent,
  showBadge = false,
  ...props
}) => {
  const content = (
    <>
      {children}
      {showBadge && badgeContent && (
        <span style={{ marginLeft: '4px' }}>
          <Badge 
            badgeContent={badgeContent} 
            color="error" 
            sx={{ 
              '& .MuiBadge-badge': {
                minWidth: '6px',
                height: '6px',
                padding: '2px',
                fontSize: '0.5rem'
              }
            }}
          />
        </span>
      )}
    </>
  );

  return (
    <StyledTab
      active={active}
      showBadge={showBadge}
      disableElevation
      disabled={disabled}
      disableRipple
      {...props}
    >
      {content}
    </StyledTab>
  );
};

export default TabSmall;