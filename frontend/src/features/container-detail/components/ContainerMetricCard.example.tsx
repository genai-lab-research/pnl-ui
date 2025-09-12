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
const normalTemperatureData: ContainerMetricCardProps = {
  title: 'Air Temperature',
  value: 20,
  targetValue: 21,
  unit: '°C',
  status: 'normal',
};

const warningTemperatureData: ContainerMetricCardProps = {
  title: 'Air Temperature',
  value: 25,
  targetValue: 21,
  unit: '°C',
  status: 'warning',
};

const criticalTemperatureData: ContainerMetricCardProps = {
  title: 'Air Temperature',
  value: 30,
  targetValue: 21,
  unit: '°C',
  status: 'critical',
};

const fahrenheitTemperatureData: ContainerMetricCardProps = {
  title: 'Air Temperature',
  value: 68,
  targetValue: 70,
  unit: '°F',
  status: 'normal',
};

const noTargetTemperatureData: ContainerMetricCardProps = {
  title: 'Air Temperature',
  value: 22,
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
        {...normalTemperatureData}
        onClick={() => handleCardClick('normal')}
      />

      {/* With subtitle */}
      <ContainerMetricCard
        {...normalTemperatureData}
        subtitle="Zone A"
        onClick={() => handleCardClick('with subtitle')}
      />

      {/* Warning state */}
      <ContainerMetricCard
        {...warningTemperatureData}
        subtitle="High temperature detected"
        onClick={() => handleCardClick('warning')}
      />

      {/* Critical state */}
      <ContainerMetricCard
        {...criticalTemperatureData}
        subtitle="Critical - check cooling system"
        onClick={() => handleCardClick('critical')}
      />

      {/* Fahrenheit units */}
      <ContainerMetricCard
        {...fahrenheitTemperatureData}
        subtitle="US units"
        onClick={() => handleCardClick('fahrenheit')}
      />

      {/* No target value */}
      <ContainerMetricCard
        {...noTargetTemperatureData}
        subtitle="Monitoring only"
        onClick={() => handleCardClick('no target')}
      />

      {/* Loading state */}
      <ContainerMetricCard
        {...normalTemperatureData}
        loading={true}
      />

      {/* Error state */}
      <ContainerMetricCard
        {...normalTemperatureData}
        error="Failed to load temperature data"
      />

      {/* Disabled state */}
      <ContainerMetricCard
        {...normalTemperatureData}
        subtitle="Disabled sensor"
        disabled={true}
      />
    </div>
  );
};

// Export individual examples for Storybook or other documentation
export const NormalTemperatureExample = () => (
  <ContainerMetricCard
    {...normalTemperatureData}
    onClick={() => console.log('Temperature card clicked')}
  />
);

export const WarningTemperatureExample = () => (
  <ContainerMetricCard
    {...warningTemperatureData}
    subtitle="Temperature warning"
    onClick={() => console.log('Warning card clicked')}
  />
);

export const LoadingExample = () => (
  <ContainerMetricCard
    {...normalTemperatureData}
    loading={true}
  />
);

export const ErrorExample = () => (
  <ContainerMetricCard
    {...normalTemperatureData}
    error="Sensor connection failed"
  />
);

export default ContainerMetricCardExamples;
