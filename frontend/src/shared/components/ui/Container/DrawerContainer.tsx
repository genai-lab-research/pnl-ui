import React from 'react';
import { Slide, Fade } from '@mui/material';

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
          className="fixed inset-0 bg-black bg-opacity-50 z-[99998]"
          style={{ display: open ? 'block' : 'none' }}
        />
      </Fade>
      
      {/* Drawer content */}
      <Slide
        direction="left"
        in={open}
        mountOnEnter
        unmountOnExit
      >
        <div 
          className={`fixed inset-y-0 right-0 flex flex-col bg-white border-l border-gray-200 shadow-md overflow-auto z-[99999] ${className}`}
          style={{ width }}
        >
          {children}
        </div>
      </Slide>
    </>
  );
};

export default DrawerContainer;