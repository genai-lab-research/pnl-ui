import { TableRow } from '../types';

/**
 * Gets the appropriate type icon path based on the row type
 */
export const getTypeIconPath = (type: TableRow['type']): string => {
  const iconPaths = {
    container: '/2615_204716/component_2615_204797.svg',
    virtual: '/2615_204716/component_2615_204881.svg',
  };
  
  return iconPaths[type];
};

/**
 * Gets the appropriate alert icon path based on alert status
 */
export const getAlertIconPath = (hasAlert: boolean): string => {
  return hasAlert 
    ? '/2615_204716/component_2615_204752.svg'
    : '/2615_204716/component_2615_204874.svg';
};

/**
 * Gets the actions menu icon path
 */
export const getActionsIconPath = (): string => {
  return '/2615_204716/component_2615_204878.svg';
};

/**
 * Gets the alt text for type icons
 */
export const getTypeIconAlt = (type: TableRow['type']): string => {
  const altTexts = {
    container: 'Container',
    virtual: 'Virtual Farm',
  };
  
  return altTexts[type];
};

/**
 * Gets the alt text for alert icons
 */
export const getAlertIconAlt = (hasAlert: boolean): string => {
  return hasAlert ? 'Alert' : 'No Alert';
};