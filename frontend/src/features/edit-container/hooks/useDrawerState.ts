// Drawer State Hook
// Manages drawer open/close state and transitions

import { useState, useCallback, useEffect } from 'react';

export interface UseDrawerStateReturn {
  isOpen: boolean;
  isClosing: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  handleBackdropClick: () => void;
  handleEscapeKey: (event: KeyboardEvent) => void;
}

export function useDrawerState(
  initialOpen = false,
  onClose?: () => void,
  closeDuration = 300
): UseDrawerStateReturn {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isClosing, setIsClosing] = useState(false);

  const openDrawer = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsClosing(true);
    
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      onClose?.();
    }, closeDuration);
  }, [onClose, closeDuration]);

  const toggleDrawer = useCallback(() => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }, [isOpen, openDrawer, closeDrawer]);

  const handleBackdropClick = useCallback(() => {
    closeDrawer();
  }, [closeDrawer]);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeDrawer();
    }
  }, [isOpen, closeDrawer]);

  // Add global escape key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, handleEscapeKey]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  return {
    isOpen,
    isClosing,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    handleBackdropClick,
    handleEscapeKey
  };
}