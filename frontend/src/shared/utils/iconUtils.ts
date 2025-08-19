import React from 'react';

/**
 * Comprehensive icon mapping utility for public images
 * Maps semantic icon names to their corresponding public image paths
 */

// Available public images mapped to semantic names
export const PUBLIC_ICONS = {
  // Container and system icons
  container: '/2615_204716/component_2615_204797.svg',
  virtual: '/2615_204716/component_2615_204881.svg',
  cart: '/2615_204716/component_2615_204839.svg', // Garden cart
  shipping: '/2615_204716/component_2615_204918.svg', // Shipping container
  
  // Alert and status icons
  alert: '/2615_204716/component_2615_204752.svg',
  success: '/2615_204716/component_2615_204874.svg',
  warning: '/2615_204716/component_2615_204790.svg',
  info: '/2615_204716/component_2615_204832.svg',
  
  // Action icons
  menu: '/2615_204716/component_2615_204878.svg',
  actions: '/2615_204716/component_2615_204755.svg', // Three dots
  settings: '/2615_204716/component_2615_204911.svg',
  
  // User and profile icons
  user: '/2615_207787/component_2615_207529.svg',
  profile: '/2615_207787/component_2615_207535.svg',
  
  // Data and metrics icons  
  data: '/2615_204716/component_2615_204793.svg',
  metrics: '/2615_204716/component_2615_204835.svg',
  chart: '/2615_204716/component_2615_204914.svg',
  
  // System and operational icons
  system: '/2615_204716/component_2615_204953.svg',
  operational: '/2615_204716/component_2615_204957.svg',
  
  // Growth and farming icons
  plant: '/2615_207721/component_2615_207081.svg',
  growth: '/2615_207743/component_2615_207109.svg',
  harvest: '/2615_207789/component_2615_207435.svg',
  
  // Temperature and environmental (using cloud icon as temperature representation)
  temperature: '/2615_204716/component_2615_204730.svg',
  environment: '/2615_204716/component_2615_204759.svg',
} as const;

export type PublicIconName = keyof typeof PUBLIC_ICONS;

/**
 * Gets the public icon path by semantic name
 */
export const getPublicIconPath = (iconName: PublicIconName): string => {
  return PUBLIC_ICONS[iconName];
};

/**
 * Creates an img element for a public icon
 */
export const createPublicIconImg = (
  iconName: PublicIconName, 
  alt: string,
  size: number = 24
): React.ReactElement => {
  return React.createElement('img', {
    src: getPublicIconPath(iconName),
    alt,
    width: size,
    height: size,
    style: { objectFit: 'contain' as const }
  });
};

/**
 * Validates if an icon name exists in public icons
 */
export const isValidPublicIcon = (iconName: string): iconName is PublicIconName => {
  return iconName in PUBLIC_ICONS;
};

/**
 * Gets all available public icon names
 */
export const getAvailableIconNames = (): PublicIconName[] => {
  return Object.keys(PUBLIC_ICONS) as PublicIconName[];
};

/**
 * Gets icon alt text based on semantic name
 */
export const getIconAltText = (iconName: PublicIconName): string => {
  const altTextMap: Record<PublicIconName, string> = {
    container: 'Container',
    virtual: 'Virtual Farm',
    cart: 'Garden Cart',
    shipping: 'Shipping Container',
    alert: 'Alert',
    success: 'Success',
    warning: 'Warning', 
    info: 'Information',
    menu: 'Menu',
    actions: 'Actions',
    settings: 'Settings',
    user: 'User',
    profile: 'Profile',
    data: 'Data',
    metrics: 'Metrics',
    chart: 'Chart',
    system: 'System',
    operational: 'Operational',
    plant: 'Plant',
    growth: 'Growth',
    harvest: 'Harvest',
    temperature: 'Temperature',
    environment: 'Environment',
  };
  
  return altTextMap[iconName] || iconName;
};