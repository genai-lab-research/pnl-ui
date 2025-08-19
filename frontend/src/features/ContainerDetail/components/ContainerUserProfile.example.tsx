import React from 'react';
import { ContainerUserProfile } from './ContainerUserProfile';

/**
 * Example usage of ContainerUserProfile component
 */
export const ContainerUserProfileExample: React.FC = () => {
  const handleProfileClick = () => {
    console.log('Profile clicked');
    // Navigate to user profile or show profile menu
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <h3>ContainerUserProfile Examples</h3>
      
      {/* Small size with image */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ContainerUserProfile
          size="sm"
          userImageUrl="https://via.placeholder.com/32x32/489F68/ffffff?text=JD"
          userName="John Doe"
          onClick={handleProfileClick}
        />
        <span>Small with image</span>
      </div>
      
      {/* Medium size (default) with image */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ContainerUserProfile
          userImageUrl="https://via.placeholder.com/40x40/489F68/ffffff?text=JS"
          userName="Jane Smith"
          onClick={handleProfileClick}
        />
        <span>Medium with image</span>
      </div>
      
      {/* Large size with image */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ContainerUserProfile
          size="lg"
          userImageUrl="https://via.placeholder.com/48x48/489F68/ffffff?text=AB"
          userName="Alex Brown"
          onClick={handleProfileClick}
        />
        <span>Large with image</span>
      </div>
      
      {/* Without image (shows default icon) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ContainerUserProfile
          userName="Default User"
          onClick={handleProfileClick}
        />
        <span>Default icon (no image)</span>
      </div>
      
      {/* Non-clickable */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ContainerUserProfile
          userName="Read Only User"
          userImageUrl="https://via.placeholder.com/40x40/cccccc/666666?text=RO"
        />
        <span>Non-clickable</span>
      </div>
      
      {/* Loading state */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ContainerUserProfile
          userName="Loading User"
          loading={true}
        />
        <span>Loading state</span>
      </div>
    </div>
  );
};

export default ContainerUserProfileExample;
