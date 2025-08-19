import React from 'react';
import { ContainerMetricCard } from './ContainerMetricCard';
import type { ContainerMetricCardProps } from './ContainerMetricCard';

/**
 * Example usage of ContainerMetricCard component
 * 
 * This example demonstrates various states and configurations of the
 * ContainerMetricCard component including normal operation, loading,
 * error states, and different temperature scenarios.
 */

// Example data that would typically come from container metrics
const normalTemperatureData: ContainerMetricCardProps['airTemperature'] = {
  current: 20,
  target: 21,
  unit: '°C',
  status: 'normal',
};

const warningTemperatureData: ContainerMetricCardProps['airTemperature'] = {
  current: 25,
  target: 21,
  unit: '°C',
  status: 'warning',
};

const criticalTemperatureData: ContainerMetricCardProps['airTemperature'] = {
  current: 30,
  target: 21,
  unit: '°C',
  status: 'critical',
};

const fahrenheitTemperatureData: ContainerMetricCardProps['airTemperature'] = {
  current: 68,
  target: 70,
  unit: '°F',
  status: 'normal',
};

const noTargetTemperatureData: ContainerMetricCardProps['airTemperature'] = {
  current: 22,
  unit: '°C',
  status: 'normal',
};

/**
 * ContainerMetricCardExamples - Showcase component for various states
 */
export const ContainerMetricCardExamples: React.FC = () => {
  const handleCardClick = (type: string) => {
    console.log(`${type} metric card clicked`);
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
      gap: '16px',
      padding: '24px',
      backgroundColor: '#f5f5f5',
    }}>
      {/* Normal temperature display */}
      <ContainerMetricCard
        airTemperature={normalTemperatureData}
        onClick={() => handleCardClick('normal')}
      />

      {/* With subtitle */}
      <ContainerMetricCard
        airTemperature={normalTemperatureData}
        subtitle="Zone A"
        onClick={() => handleCardClick('with subtitle')}
      />

      {/* Warning state */}
      <ContainerMetricCard
        airTemperature={warningTemperatureData}
        subtitle="High temperature detected"
        onClick={() => handleCardClick('warning')}
      />

      {/* Critical state */}
      <ContainerMetricCard
        airTemperature={criticalTemperatureData}
        subtitle="Critical - check cooling system"
        onClick={() => handleCardClick('critical')}
      />

      {/* Fahrenheit units */}
      <ContainerMetricCard
        airTemperature={fahrenheitTemperatureData}
        subtitle="US units"
        onClick={() => handleCardClick('fahrenheit')}
      />

      {/* No target value */}
      <ContainerMetricCard
        airTemperature={noTargetTemperatureData}
        subtitle="Monitoring only"
        onClick={() => handleCardClick('no target')}
      />

      {/* Loading state */}
      <ContainerMetricCard
        airTemperature={normalTemperatureData}
        loading={true}
      />

      {/* Error state */}
      <ContainerMetricCard
        airTemperature={normalTemperatureData}
        error="Failed to load temperature data"
      />

      {/* Disabled state */}
      <ContainerMetricCard
        airTemperature={normalTemperatureData}
        subtitle="Disabled sensor"
        disabled={true}
      />
    </div>
  );
};

// Export individual examples for Storybook or other documentation
export const NormalTemperatureExample = () => (
  <ContainerMetricCard
    airTemperature={normalTemperatureData}
    onClick={() => console.log('Temperature card clicked')}
  />
);

export const WarningTemperatureExample = () => (
  <ContainerMetricCard
    airTemperature={warningTemperatureData}
    subtitle="Temperature warning"
    onClick={() => console.log('Warning card clicked')}
  />
);

export const LoadingExample = () => (
  <ContainerMetricCard
    airTemperature={normalTemperatureData}
    loading={true}
  />
);

export const ErrorExample = () => (
  <ContainerMetricCard
    airTemperature={normalTemperatureData}
    error="Sensor connection failed"
  />
);

export default ContainerMetricCardExamples;
