import React from 'react';
import { ContainerYieldCard } from './ContainerYieldCard';
import type { ContainerYieldCardProps } from './ContainerYieldCard';

/**
 * Example usage of ContainerYieldCard component
 * 
 * This example demonstrates various states and configurations of the
 * ContainerYieldCard component including normal operation, loading,
 * error states, and different yield scenarios with delta values.
 */

// Example data that would typically come from container yield metrics
const normalYieldData = {
  title: 'Container Yield',
  value: 51,
  delta: 1.5,
  deltaDirection: 'up' as const,
  unit: 'KG',
};

const negativeYieldData = {
  title: 'Container Yield',
  value: 48,
  delta: -2.3,
  deltaDirection: 'down' as const,
  unit: 'KG',
};

const highYieldData = {
  title: 'Container Yield',
  value: 75,
  delta: 8.2,
  deltaDirection: 'up' as const,
  unit: 'KG',
};

const poundsYieldData = {
  title: 'Container Yield',
  value: 112,
  delta: 3.3,
  deltaDirection: 'up' as const,
  unit: 'LBS',
};

const noDeltaYieldData = {
  title: 'Container Yield',
  value: 45,
  unit: 'KG',
};

const zeroDeltaYieldData = {
  title: 'Container Yield',
  value: 50,
  delta: 0,
  deltaDirection: 'flat' as const,
  unit: 'KG',
};

/**
 * ContainerYieldCardExamples - Showcase component for various states
 */
export const ContainerYieldCardExamples: React.FC = () => {
  const handleCardClick = (type: string) => {
    console.log(`${type} yield card clicked`);
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
      gap: '16px',
      padding: '24px',
      backgroundColor: '#f5f5f5',
    }}>
      {/* Normal yield with positive delta */}
      <ContainerYieldCard
        {...normalYieldData}
        onClick={() => handleCardClick('normal')}
      />

      {/* With subtitle */}
      <ContainerYieldCard
        {...normalYieldData}
        subtitle="Current Harvest"
        onClick={() => handleCardClick('with subtitle')}
      />

      {/* Negative delta (yield decrease) */}
      <ContainerYieldCard
        {...negativeYieldData}
        subtitle="Yield decrease detected"
        onClick={() => handleCardClick('negative delta')}
      />

      {/* High yield with large positive delta */}
      <ContainerYieldCard
        {...highYieldData}
        subtitle="Excellent performance"
        onClick={() => handleCardClick('high yield')}
      />

      {/* Different units (pounds) */}
      <ContainerYieldCard
        {...poundsYieldData}
        subtitle="US units"
        onClick={() => handleCardClick('pounds')}
      />

      {/* No delta value */}
      <ContainerYieldCard
        {...noDeltaYieldData}
        subtitle="Initial measurement"
        onClick={() => handleCardClick('no delta')}
      />

      {/* Zero delta (no change) */}
      <ContainerYieldCard
        {...zeroDeltaYieldData}
        subtitle="Stable yield"
        onClick={() => handleCardClick('zero delta')}
      />

      {/* Loading state */}
      <ContainerYieldCard
        {...normalYieldData}
        loading={true}
      />

      {/* Error state */}
      <ContainerYieldCard
        {...normalYieldData}
        error="Failed to load yield data"
      />

      {/* Disabled state */}
      <ContainerYieldCard
        {...normalYieldData}
        subtitle="Sensor offline"
        disabled={true}
      />
    </div>
  );
};

// Export individual examples for Storybook or other documentation
export const NormalYieldExample = () => (
  <ContainerYieldCard
    {...normalYieldData}
    onClick={() => console.log('Yield card clicked')}
  />
);

export const PositiveDeltaExample = () => (
  <ContainerYieldCard
    {...highYieldData}
    subtitle="Yield increase"
    onClick={() => console.log('Positive delta card clicked')}
  />
);

export const NegativeDeltaExample = () => (
  <ContainerYieldCard
    {...negativeYieldData}
    subtitle="Yield decrease"
    onClick={() => console.log('Negative delta card clicked')}
  />
);

export const LoadingExample = () => (
  <ContainerYieldCard
    {...normalYieldData}
    loading={true}
  />
);

export const ErrorExample = () => (
  <ContainerYieldCard
    {...normalYieldData}
    error="Sensor connection failed"
  />
);

export const DifferentUnitsExample = () => (
  <ContainerYieldCard
    {...poundsYieldData}
    subtitle="Imperial units"
    onClick={() => console.log('Different units card clicked')}
  />
);

export default ContainerYieldCardExamples;
