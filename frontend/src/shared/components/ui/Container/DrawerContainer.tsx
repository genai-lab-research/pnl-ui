import React from 'react';

import { Fade, Slide } from '@mui/material';

export interface DrawerContainerProps {
  /**
   * The drawer content
   */
  children: React.ReactNode;

  /**
   * Optional class name for custom styling
   */
  className?: string;

  /**
   * Optional width for the drawer
   * @default 400
   */
  width?: number | string;

  /**
   * Controls whether the drawer is open
   * @default false
   */
  open?: boolean;
}

/**
 * DrawerContainer component for slide-in drawer panels
 * Slides in from the right side and takes full height of the screen
 * Includes a backdrop overlay that dims the background content when open
 */
export const DrawerContainer: React.FC<DrawerContainerProps> = ({
  children,
  className = '',
  width = 400,
  open = false,
}) => {
  return (
    <>
      {/* Backdrop overlay for dimming the background */}
      <Fade in={open}>
        <div
          className="fixed inset-0 z-[99998] bg-black bg-opacity-50"
          style={{ display: open ? 'block' : 'none' }}
        />
      </Fade>

      {/* Drawer content */}
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <div
          className={`fixed inset-y-0 right-0 z-[99999] flex flex-col overflow-auto border-l border-gray-200 bg-white shadow-md ${className}`}
          style={{ width }}
        >
          {children}
        </div>
      </Slide>
    </>
  );
};

export default DrawerContainer;
