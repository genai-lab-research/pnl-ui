import React from "react";
import { Button, ButtonProps, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface TabMediumProps extends Omit<ButtonProps, "variant"> {
  active?: boolean;
  badgeContent?: React.ReactNode;
  showBadge?: boolean;
}

const StyledTab = styled(Button, {
  shouldForwardProp: (prop) => !['active', 'showBadge'].includes(String(prop)),
})<{ active?: boolean; showBadge?: boolean }>(({ theme, active }) => ({
  textTransform: "none",
  minWidth: 120,
  height: 48,
  padding: theme.spacing(2, 3),
  borderRadius: 0,
  position: 'relative',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: "transparent",
  boxShadow: "none",
  fontWeight: 500,
  fontSize: "1rem",
  letterSpacing: "0.1px",
  lineHeight: "24px",
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

export const TabMedium: React.FC<TabMediumProps> = ({
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
        <span style={{ marginLeft: '8px' }}>
          <Badge 
            badgeContent={badgeContent} 
            color="error" 
            sx={{ 
              '& .MuiBadge-badge': {
                minWidth: '8px',
                height: '8px',
                padding: '4px',
                fontSize: '0.75rem'
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

export default TabMedium;