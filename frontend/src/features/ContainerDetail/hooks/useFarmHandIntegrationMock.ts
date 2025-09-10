import { useState, useEffect } from 'react';

interface FarmHandIntegrationState {
  isConnected: boolean;
  isIframeLoading: boolean;
  isConnectionInitializing: boolean;
  error: { message: string } | null;
  iframeUrl: string | null;
  environmentSystem: string | null;
  lastSync: string | null;
}

export const useFarmHandIntegrationMock = () => {
  const [state, setState] = useState<FarmHandIntegrationState>({
    isConnected: true,
    isIframeLoading: false,
    isConnectionInitializing: false,
    error: null,
    iframeUrl: '/farmhand-demo.html',
    environmentSystem: 'FarmHand',
    lastSync: new Date().toISOString(),
  });

  const openInFarmHand = () => {
    window.open('https://farmhand.example.com', '_blank');
  };

  const initializeConnection = (system: string) => {
    setState(prev => ({ ...prev, isConnectionInitializing: true }));
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isConnectionInitializing: false,
        isConnected: true,
        environmentSystem: system,
      }));
    }, 2000);
  };

  useEffect(() => {
    // Simulate loading iframe
    if (state.isConnected && !state.iframeUrl) {
      setState(prev => ({ ...prev, isIframeLoading: true }));
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isIframeLoading: false,
          iframeUrl: '/farmhand-demo.html',
        }));
      }, 1000);
    }
  }, [state.isConnected, state.iframeUrl]);

  return {
    ...state,
    openInFarmHand,
    initializeConnection,
  };
};