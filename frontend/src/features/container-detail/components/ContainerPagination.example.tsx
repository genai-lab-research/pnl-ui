import React, { useState } from 'react';
import { ContainerPagination } from './ContainerPagination';
import { PaginationModel } from '../types/ui-models';

/**
 * Example usage of ContainerPagination component
 * 
 * Demonstrates different scenarios and configurations for the container
 * pagination component including various data contexts and states.
 */
export const ContainerPaginationExample: React.FC = () => {
  // Example pagination state for crops data
  const [cropsPage, setCropsPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [inventoryPage, setInventoryPage] = useState(3);

  // Mock pagination models for different data types
  const cropsPagination: PaginationModel = {
    currentPage: cropsPage,
    totalPages: 5,
    totalItems: 48,
    itemsPerPage: 10,
    onPageChange: setCropsPage,
    onItemsPerPageChange: () => {} // Not used in this example
  };

  const activitiesPagination: PaginationModel = {
    currentPage: activitiesPage,
    totalPages: 12,
    totalItems: 115,
    itemsPerPage: 10,
    onPageChange: setActivitiesPage,
    onItemsPerPageChange: () => {}
  };

  const inventoryPagination: PaginationModel = {
    currentPage: inventoryPage,
    totalPages: 7,
    totalItems: 67,
    itemsPerPage: 10,
    onPageChange: setInventoryPage,
    onItemsPerPageChange: () => {}
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8f9fa' }}>
      <h2 style={{ marginBottom: '32px', color: '#2c3e50' }}>
        ContainerPagination Examples
      </h2>

      {/* Example 1: Crops Table Pagination */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#34495e' }}>
          Crops Table Pagination
        </h3>
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #e1e8ed'
        }}>
          <ContainerPagination
            pagination={cropsPagination}
            containerId="CT-2024-001"
            dataContext="crops"
          />
        </div>
      </section>

      {/* Example 2: Activity Log Pagination */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#34495e' }}>
          Activity Log Pagination
        </h3>
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #e1e8ed'
        }}>
          <ContainerPagination
            pagination={activitiesPagination}
            containerId="CT-2024-001"
            dataContext="activities"
          />
        </div>
      </section>

      {/* Example 3: Inventory Pagination (Mid-page) */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#34495e' }}>
          Inventory Pagination (Mid-page)
        </h3>
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #e1e8ed'
        }}>
          <ContainerPagination
            pagination={inventoryPagination}
            containerId="CT-2024-001"
            dataContext="inventory"
          />
        </div>
      </section>

      {/* Example 4: Disabled State */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#34495e' }}>
          Disabled State (Loading)
        </h3>
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #e1e8ed'
        }}>
          <ContainerPagination
            pagination={cropsPagination}
            containerId="CT-2024-001"
            dataContext="crops"
            disabled={true}
          />
        </div>
      </section>

      {/* Example 5: Single Page (No pagination needed) */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#34495e' }}>
          Single Page (No Navigation)
        </h3>
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #e1e8ed'
        }}>
          <ContainerPagination
            pagination={{
              currentPage: 1,
              totalPages: 1,
              totalItems: 3,
              itemsPerPage: 10,
              onPageChange: () => {},
              onItemsPerPageChange: () => {}
            }}
            containerId="CT-2024-001"
            dataContext="devices"
          />
        </div>
      </section>

      {/* Example 6: Custom styling */}
      <section>
        <h3 style={{ marginBottom: '16px', color: '#34495e' }}>
          Custom Styling
        </h3>
        <div style={{ 
          padding: '16px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #e1e8ed'
        }}>
          <ContainerPagination
            pagination={cropsPagination}
            containerId="CT-2024-001"
            dataContext="crops"
            className="custom-pagination-styling"
          />
        </div>
      </section>
    </div>
  );
};

export default ContainerPaginationExample;
