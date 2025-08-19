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
const normalYieldData: ContainerYieldCardProps['yieldData'] = {
  current: 51,
  delta: 1.5,
  unit: 'KG',
  status: 'normal',
};

const negativeYieldData: ContainerYieldCardProps['yieldData'] = {
  current: 48,
  delta: -2.3,
  unit: 'KG',
  status: 'warning',
};

const highYieldData: ContainerYieldCardProps['yieldData'] = {
  current: 75,
  delta: 8.2,
  unit: 'KG',
  status: 'normal',
};

const poundsYieldData: ContainerYieldCardProps['yieldData'] = {
  current: 112,
  delta: 3.3,
  unit: 'LBS',
  status: 'normal',
};

const noDeltaYieldData: ContainerYieldCardProps['yieldData'] = {
  current: 45,
  unit: 'KG',
  status: 'normal',
};

const zeroDeltaYieldData: ContainerYieldCardProps['yieldData'] = {
  current: 50,
  delta: 0,
  unit: 'KG',
  status: 'normal',
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
        yield={normalYieldData}
        onClick={() => handleCardClick('normal')}
      />

      {/* With subtitle */}
      <ContainerYieldCard
        yield={normalYieldData}
        subtitle="Current Harvest"
        onClick={() => handleCardClick('with subtitle')}
      />

      {/* Negative delta (yield decrease) */}
      <ContainerYieldCard
        yield={negativeYieldData}
        subtitle="Yield decrease detected"
        onClick={() => handleCardClick('negative delta')}
      />

      {/* High yield with large positive delta */}
      <ContainerYieldCard
        yield={highYieldData}
        subtitle="Excellent performance"
        onClick={() => handleCardClick('high yield')}
      />

      {/* Different units (pounds) */}
      <ContainerYieldCard
        yield={poundsYieldData}
        subtitle="US units"
        onClick={() => handleCardClick('pounds')}
      />

      {/* No delta value */}
      <ContainerYieldCard
        yield={noDeltaYieldData}
        subtitle="Initial measurement"
        onClick={() => handleCardClick('no delta')}
      />

      {/* Zero delta (no change) */}
      <ContainerYieldCard
        yield={zeroDeltaYieldData}
        subtitle="Stable yield"
        onClick={() => handleCardClick('zero delta')}
      />

      {/* Loading state */}
      <ContainerYieldCard
        yield={normalYieldData}
        loading={true}
      />

      {/* Error state */}
      <ContainerYieldCard
        yield={normalYieldData}
        error="Failed to load yield data"
      />

      {/* Disabled state */}
      <ContainerYieldCard
        yield={normalYieldData}
        subtitle="Sensor offline"
        disabled={true}
      />
    </div>
  );
};

// Export individual examples for Storybook or other documentation
export const NormalYieldExample = () => (
  <ContainerYieldCard
    yield={normalYieldData}
    onClick={() => console.log('Yield card clicked')}
  />
);

export const PositiveDeltaExample = () => (
  <ContainerYieldCard
    yield={highYieldData}
    subtitle="Yield increase"
    onClick={() => console.log('Positive delta card clicked')}
  />
);

export const NegativeDeltaExample = () => (
  <ContainerYieldCard
    yield={negativeYieldData}
    subtitle="Yield decrease"
    onClick={() => console.log('Negative delta card clicked')}
  />
);

export const LoadingExample = () => (
  <ContainerYieldCard
    yield={normalYieldData}
    loading={true}
  />
);

export const ErrorExample = () => (
  <ContainerYieldCard
    yield={normalYieldData}
    error="Sensor connection failed"
  />
);

export const DifferentUnitsExample = () => (
  <ContainerYieldCard
    yield={poundsYieldData}
    subtitle="Imperial units"
    onClick={() => console.log('Different units card clicked')}
  />
);

export default ContainerYieldCardExamples;
