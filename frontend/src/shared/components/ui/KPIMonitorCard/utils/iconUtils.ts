import React from 'react';
import { DeviceThermostat, WaterDrop, Air, Speed, Opacity, Co2 } from '@mui/icons-material';
import { getPublicIconPath, getIconAltText, isValidPublicIcon, PublicIconName } from '../../../../utils/iconUtils';

/**
 * Icon mapping utility for KPIMonitorCard
 * Maps icon names to their corresponding public images or Material-UI icons as fallbacks
 */
export const getIconByName = (iconName?: string): React.ReactElement | null => {
  if (!iconName) return React.createElement(DeviceThermostat);
  
  // Try public icons first
  if (isValidPublicIcon(iconName)) {
    return React.createElement('img', {
      src: getPublicIconPath(iconName as PublicIconName),
      alt: getIconAltText(iconName as PublicIconName),
      width: 24,
      height: 24,
      style: { objectFit: 'contain' as const }
    });
  }
  
  // Fallback to Material-UI icons for specific metric types
  const iconMap: Record<string, React.ComponentType> = {
    thermostat: DeviceThermostat,
    temperature: DeviceThermostat,
    water: WaterDrop,
    humidity: Opacity,
    air: Air,
    speed: Speed,
    co2: Co2,
    metrics: DeviceThermostat, // Use thermostat as default for metrics
    data: DeviceThermostat,
    system: DeviceThermostat,
  };
  
  const IconComponent = iconMap[iconName.toLowerCase()];
  
  if (!IconComponent) {
    // Try to map common names to public icons
    const publicIconMapping: Record<string, PublicIconName> = {
      'garden_cart': 'cart',
      'container': 'container',
      'virtual': 'virtual',
      'alert': 'alert',
      'warning': 'warning',
      'success': 'success',
      'info': 'info',
      'user': 'user',
      'plant': 'plant',
      'growth': 'growth',
      'harvest': 'harvest',
    };
    
    const publicIconName = publicIconMapping[iconName.toLowerCase()];
    if (publicIconName) {
      return React.createElement('img', {
        src: getPublicIconPath(publicIconName),
        alt: getIconAltText(publicIconName),
        width: 24,
        height: 24,
        style: { objectFit: 'contain' as const }
      });
    }
    
    console.warn(`Icon "${iconName}" not found, using default thermostat icon`);
    return React.createElement(DeviceThermostat);
  }
  
  return React.createElement(IconComponent);
};

/**
 * Validates if an icon name is supported (either public icon or Material-UI icon)
 */
export const isValidIconName = (iconName?: string): boolean => {
  if (!iconName) return true; // undefined is valid (will use default)
  
  // Check public icons first
  if (isValidPublicIcon(iconName)) return true;
  
  // Check Material-UI icon names
  const validMaterialIconNames = ['thermostat', 'temperature', 'water', 'air', 'speed', 'humidity', 'co2', 'metrics', 'data', 'system'];
  if (validMaterialIconNames.includes(iconName.toLowerCase())) return true;
  
  // Check common name mappings
  const commonMappings = ['garden_cart', 'container', 'virtual', 'alert', 'warning', 'success', 'info', 'user', 'plant', 'growth', 'harvest'];
  return commonMappings.includes(iconName.toLowerCase());
};
