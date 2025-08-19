import React, { useState } from 'react';
import { ContainerTabNavigation } from './ContainerTabNavigation';
import { CONTAINER_TABS } from '../types/ui-models';

/**
 * Example usage of ContainerTabNavigation component
 */
export const ContainerTabNavigationExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(false);

  // Example badge counts for demonstration
  const badgeCounts = {
    overview: 3,
    environment: 12,
    inventory: 45,
    devices: 8,
  };

  const handleTabChange = (tabValue: string) => {
    setLoading(true);
    setActiveTab(tabValue);
    
    // Simulate async tab loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Container Tab Navigation Examples</h3>
      
      {/* Basic Usage */}
      <div style={{ marginBottom: '30px' }}>
        <h4>Basic Usage</h4>
        <ContainerTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerId="CONT-001"
        />
        <p>Active tab: {activeTab}</p>
      </div>

      {/* With Badge Counts */}
      <div style={{ marginBottom: '30px' }}>
        <h4>With Badge Counts</h4>
        <ContainerTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerId="CONT-001"
          showBadges={true}
          badgeCounts={badgeCounts}
        />
      </div>

      {/* Different Variants */}
      <div style={{ marginBottom: '30px' }}>
        <h4>Outlined Variant</h4>
        <ContainerTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerId="CONT-001"
          variant="outlined"
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h4>Compact Size</h4>
        <ContainerTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerId="CONT-001"
          size="sm"
          variant="compact"
        />
      </div>

      {/* Loading State */}
      <div style={{ marginBottom: '30px' }}>
        <h4>Loading State</h4>
        <ContainerTabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          containerId="CONT-001"
          loading={loading}
        />
      </div>

      {/* Custom Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <h4>Custom Tabs</h4>
        <ContainerTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerId="CONT-001"
          customTabs={[
            { id: 'summary', label: 'Summary', value: 'summary' },
            { id: 'metrics', label: 'Metrics', value: 'metrics' },
            { id: 'settings', label: 'Settings', value: 'settings', disabled: true },
          ]}
        />
      </div>

      {/* Error State */}
      <div style={{ marginBottom: '30px' }}>
        <h4>Error State</h4>
        <ContainerTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerId="CONT-001"
          error="Failed to load tab data"
        />
      </div>

      {/* Disabled State */}
      <div style={{ marginBottom: '30px' }}>
        <h4>Disabled State</h4>
        <ContainerTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerId="CONT-001"
          disabled={true}
        />
      </div>
    </div>
  );
};

export default ContainerTabNavigationExample;
