import React from 'react';
import { ContainerActivityItem } from './ContainerActivityItem';
import type { ContainerActivityModel } from '../types/ui-models';

// Example activity data that matches the Figma design
const exampleActivity: ContainerActivityModel = {
  id: 1,
  message: 'Environment mode switched to Auto',
  timestamp: 'April 10, 2025 – 10:00 PM',
  author: 'Markus Johnson',
  category: 'System Settings',
  actionType: 'environment_change'
};

const moreActivities: ContainerActivityModel[] = [
  {
    id: 2,
    message: 'New sensors installed in container',
    timestamp: 'April 10, 2025 – 09:30 PM',
    author: 'Sarah Chen',
    category: 'Hardware',
    actionType: 'hardware_install'
  },
  {
    id: 3,
    message: 'pH levels adjusted to optimal range',
    timestamp: 'April 10, 2025 – 08:45 PM',
    author: 'System Automation',
    category: 'Maintenance',
    actionType: 'ph_adjustment'
  }
];

// Usage examples
export const ContainerActivityItemExamples: React.FC = () => {
  const handleActivityClick = (activityId: number) => {
    console.log(`Activity ${activityId} clicked`);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3>Container Activity Item Examples</h3>
      
      {/* Basic usage matching Figma design */}
      <div>
        <h4>Basic Activity Item (matches Figma design)</h4>
        <ContainerActivityItem 
          activity={exampleActivity}
          onClick={() => handleActivityClick(exampleActivity.id)}
        />
      </div>

      {/* Different sizes */}
      <div>
        <h4>Different Sizes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ContainerActivityItem 
            activity={moreActivities[0]}
            size="sm"
            onClick={() => handleActivityClick(moreActivities[0].id)}
          />
          <ContainerActivityItem 
            activity={moreActivities[1]}
            size="md"
            onClick={() => handleActivityClick(moreActivities[1].id)}
          />
          <ContainerActivityItem 
            activity={moreActivities[2]}
            size="lg"
            onClick={() => handleActivityClick(moreActivities[2].id)}
          />
        </div>
      </div>

      {/* Different variants */}
      <div>
        <h4>Different Variants</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ContainerActivityItem 
            activity={exampleActivity}
            variant="default"
          />
          <ContainerActivityItem 
            activity={moreActivities[0]}
            variant="compact"
          />
          <ContainerActivityItem 
            activity={moreActivities[1]}
            variant="outlined"
          />
          <ContainerActivityItem 
            activity={moreActivities[2]}
            variant="elevated"
          />
        </div>
      </div>

      {/* Loading state */}
      <div>
        <h4>Loading State</h4>
        <ContainerActivityItem 
          activity={exampleActivity}
          loading={true}
        />
      </div>

      {/* Error state */}
      <div>
        <h4>Error State</h4>
        <ContainerActivityItem 
          activity={exampleActivity}
          error="Failed to load activity data"
        />
      </div>

      {/* Activity feed example */}
      <div>
        <h4>Activity Feed Example</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '8px' }}>
          {[exampleActivity, ...moreActivities].map((activity) => (
            <ContainerActivityItem
              key={activity.id}
              activity={activity}
              variant="compact"
              onClick={() => handleActivityClick(activity.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContainerActivityItemExamples;