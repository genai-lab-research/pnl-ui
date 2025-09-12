import React from 'react';
import { DetailInfoCard } from '../../../shared/components/ui/DetailInfoCard';
import { DataRow, StatusBadge, InfoSection } from '../../../shared/components/ui/DetailInfoCard/types';

// Container type icon - matches Figma design
const ShippingContainerIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M3 8V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V8M3 8L5 6H19L21 8M3 8H21M8 12H16M8 16H12" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export interface ContainerInfoPanelProps {
  /** Container information data */
  containerInfo: Array<{ label: string; value: string }>;
  /** Edit mode state */
  editMode?: boolean;
  /** Can edit permission */
  canEdit?: boolean;
  /** Can save state */
  canSave?: boolean;
  /** Is saving state */
  isSaving?: boolean;
  /** Edit handler */
  onEdit?: () => void;
  /** Save handler */
  onSave?: () => void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
}

/**
 * ContainerInfoPanel - A comprehensive container information display component
 * 
 * This component displays detailed container metadata including:
 * - Basic information (name, type, tenant, purpose, location)
 * - Status with badge styling
 * - Timestamps (created, last modified)
 * - Creator information
 * - Seed type information
 * - Optional notes section
 * 
 * Built using the DetailInfoCard atomic component to ensure consistency
 * with the design system and proper accessibility.
 */
export const ContainerInfoPanel: React.FC<ContainerInfoPanelProps> = ({
  containerInfo,
  editMode = false,
  canEdit = false,
  canSave = false,
  isSaving = false,
  onEdit,
  onSave,
  onCancel,
  loading = false,
  error,
  onClick,
  className,
}) => {
  // Map status to badge variant - matching VerticalFarmingTable statuses
  const getStatusVariant = (status: string): StatusBadge['variant'] => {
    if (!status) return 'inactive';
    
    switch (status.toLowerCase()) {
      case 'active':
      case 'connected':
        return 'active';
      case 'inactive':
        return 'inactive';
      case 'maintenance':
        return 'warning';
      case 'created':
        return 'created';
      case 'error':
        return 'error';
      default:
        return 'active';
    }
  };

  // Build data rows from containerInfo, filtering out empty or placeholder values
  const dataRows: DataRow[] = containerInfo && Array.isArray(containerInfo) 
    ? containerInfo
        .filter(info => info.label && info.value && info.value !== '000000' && info.value.trim() !== '')
        .map(info => ({
          label: info.label,
          value: info.value || 'No data',
          icon: info.label === 'Type' ? <ShippingContainerIcon size={16} /> : undefined,
        }))
    : [];

  // Find status row for badge configuration
  const statusInfo = containerInfo && Array.isArray(containerInfo) ? containerInfo.find(info => info.label.toLowerCase() === 'status') : undefined;
  const statusBadge: StatusBadge | undefined = statusInfo ? {
    text: statusInfo.value,
    variant: getStatusVariant(statusInfo.value),
  } : undefined;

  // Build additional sections for edit controls
  const sections: InfoSection[] = [];
  
  if (editMode) {
    sections.push({
      title: 'Edit Actions',
      content: (
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button 
            onClick={onSave} 
            disabled={!canSave || isSaving}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: canSave && !isSaving ? 'pointer' : 'not-allowed',
              opacity: canSave && !isSaving ? 1 : 0.5
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={onCancel} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )
    });
  } else if (canEdit) {
    sections.push({
      title: 'Actions',
      content: (
        <button 
          onClick={onEdit} 
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          Edit Settings
        </button>
      )
    });
  }

  // If no data rows after filtering, show "No data" message
  if (dataRows.length === 0 && !loading && !error) {
    return (
      <div 
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
          minHeight: '120px'
        }}
      >
        <span 
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#666',
            textAlign: 'center'
          }}
        >
          No data
        </span>
      </div>
    );
  }

  return (
    <DetailInfoCard
      title="Container Information"
      dataRows={dataRows}
      statusBadge={statusBadge}
      sections={sections.length > 0 ? sections : undefined}
      variant="default"
      size="md"
      loading={loading}
      error={error}
      onClick={onClick}
      className={className}
      ariaLabel="Container information panel"
    />
  );
};