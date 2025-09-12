import React from 'react';
import { ContainerNavigationBlock } from './ContainerNavigationBlock';

/**
 * Example usage of ContainerNavigationBlock component
 * This file demonstrates how to integrate the component in a container detail page
 */
export const ContainerNavigationBlockExample: React.FC = () => {
  const handleNavigateBack = () => {
    // Navigation logic to go back to container dashboard
    console.log('Navigating back to container dashboard');
    // In a real app, this would use React Router:
    // navigate('/containers');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>ContainerNavigationBlock Examples</h2>
      
      {/* Basic usage */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Basic Breadcrumb</h3>
        <ContainerNavigationBlock
          containerId="farm-container-04"
          onNavigate={handleNavigateBack}
        />
      </div>
      
      {/* Loading state */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Loading State</h3>
        <ContainerNavigationBlock
          containerId="farm-container-04"
          onNavigate={handleNavigateBack}
          loading={true}
        />
      </div>
      
      {/* Without navigation handler */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Display Only (No Navigation)</h3>
        <ContainerNavigationBlock
          containerId="greenhouse-a1"
        />
      </div>
      
      {/* Different container IDs */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Different Container Examples</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ContainerNavigationBlock
            containerId="hydroponic-unit-12"
            onNavigate={handleNavigateBack}
          />
          <ContainerNavigationBlock
            containerId="vertical-tower-03"
            onNavigate={handleNavigateBack}
          />
          <ContainerNavigationBlock
            containerId="seedling-tray-a5"
            onNavigate={handleNavigateBack}
          />
        </div>
      </div>
    </div>
  );
};

export default ContainerNavigationBlockExample;
