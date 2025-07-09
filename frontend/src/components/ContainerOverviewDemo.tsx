import React, { useState, useEffect } from 'react';
import { containerOverviewService } from '../api/containerOverviewService';
import { ContainerOverview, DashboardSummary } from '../types/containerOverview';
import { useAuth } from '../context/AuthContext.tsx';

export const ContainerOverviewDemo: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [overview, setOverview] = useState<ContainerOverview | null>(null);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContainerData = async (containerId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch container overview
      const overviewData = await containerOverviewService.getContainerOverview(containerId, {
        time_range: 'week',
        metric_interval: 'day'
      });
      setOverview(overviewData);

      // Fetch dashboard summary
      const summaryData = await containerOverviewService.getDashboardSummary(containerId);
      setDashboardSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch container data');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = () => {
    fetchContainerData(1); // Use container ID 1 for demo
  };

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view container overview</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Container Overview Demo</h2>
      
      <button 
        onClick={handleFetchData}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Loading...' : 'Fetch Container Data'}
      </button>

      {error && (
        <div style={{ 
          color: 'red', 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          borderRadius: '4px' 
        }}>
          Error: {error}
        </div>
      )}

      {overview && (
        <div style={{ marginTop: '20px' }}>
          <h3>Container Overview</h3>
          <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
            <h4>Container Info</h4>
            <p><strong>Name:</strong> {overview.container.name}</p>
            <p><strong>Type:</strong> {overview.container.type}</p>
            <p><strong>Status:</strong> {overview.container.status}</p>
            <p><strong>Tenant:</strong> {overview.container.tenant.name}</p>
            
            <h4>Current Metrics</h4>
            <p><strong>Temperature:</strong> {overview.dashboard_metrics.air_temperature}°C</p>
            <p><strong>Humidity:</strong> {overview.dashboard_metrics.humidity}%</p>
            <p><strong>CO2:</strong> {overview.dashboard_metrics.co2} ppm</p>
            
            <h4>Yield Performance</h4>
            <p><strong>Average Yield:</strong> {overview.dashboard_metrics.yield.average} kg</p>
            <p><strong>Total Yield:</strong> {overview.dashboard_metrics.yield.total} kg</p>
            
            <h4>Space Utilization</h4>
            <p><strong>Nursery Station:</strong> {overview.dashboard_metrics.space_utilization.nursery_station}%</p>
            <p><strong>Cultivation Area:</strong> {overview.dashboard_metrics.space_utilization.cultivation_area}%</p>
            
            <h4>Crop Summary</h4>
            {overview.crops_summary.map((crop, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <p><strong>Seed Type:</strong> {crop.seed_type}</p>
                <p><strong>Nursery Count:</strong> {crop.nursery_station_count}</p>
                <p><strong>Cultivation Count:</strong> {crop.cultivation_area_count}</p>
                <p><strong>Average Age:</strong> {crop.average_age} days</p>
                <p><strong>Overdue:</strong> {crop.overdue_count}</p>
              </div>
            ))}
            
            <h4>Recent Activity</h4>
            {overview.recent_activity.map((activity, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <p><strong>Action:</strong> {activity.action_type}</p>
                <p><strong>Actor:</strong> {activity.actor_type} ({activity.actor_id})</p>
                <p><strong>Description:</strong> {activity.description}</p>
                <p><strong>Time:</strong> {new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {dashboardSummary && (
        <div style={{ marginTop: '20px' }}>
          <h3>Dashboard Summary</h3>
          <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '4px' }}>
            <h4>Current Metrics</h4>
            <p><strong>Temperature:</strong> {dashboardSummary.current_metrics.air_temperature}°C</p>
            <p><strong>Humidity:</strong> {dashboardSummary.current_metrics.humidity}%</p>
            <p><strong>CO2:</strong> {dashboardSummary.current_metrics.co2} ppm</p>
            <p><strong>Yield:</strong> {dashboardSummary.current_metrics.yield_kg} kg</p>
            <p><strong>Space Utilization:</strong> {dashboardSummary.current_metrics.space_utilization_pct}%</p>
            
            <h4>Crop Counts</h4>
            <p><strong>Total Crops:</strong> {dashboardSummary.crop_counts.total_crops}</p>
            <p><strong>Nursery Crops:</strong> {dashboardSummary.crop_counts.nursery_crops}</p>
            <p><strong>Cultivation Crops:</strong> {dashboardSummary.crop_counts.cultivation_crops}</p>
            <p><strong>Overdue Crops:</strong> {dashboardSummary.crop_counts.overdue_crops}</p>
            
            <p><strong>Activity Count:</strong> {dashboardSummary.activity_count}</p>
            <p><strong>Last Updated:</strong> {new Date(dashboardSummary.last_updated).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerOverviewDemo;