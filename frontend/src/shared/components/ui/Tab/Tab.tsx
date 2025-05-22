import React from "react";
import { Button, ButtonProps, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface TabProps extends Omit<ButtonProps, "variant"> {
  active?: boolean;
  badgeContent?: React.ReactNode;
  showBadge?: boolean;
}

const StyledTab = styled(Button, {
  shouldForwardProp: (prop) => !['active', 'showBadge'].includes(String(prop)),
})<{ active?: boolean; showBadge?: boolean }>(({ theme, active }) => ({
  textTransform: "none",
  position: 'relative',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: "transparent",
  boxShadow: "none",
  borderRadius: 0,
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

export const Tab: React.FC<TabProps> = ({
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

export default Tab;