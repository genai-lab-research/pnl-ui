import { useState, useEffect } from 'react';
import { containerService, Container } from '../../api';

export const ContainerDemo = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await containerService.listContainers();
        
        if (result.error) {
          setError(result.error.detail);
        } else {
          setContainers(result.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchContainers();
  }, []);

  if (loading) {
    return <div className="p-4">Loading containers...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800 font-semibold">Error</h3>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-red-500 mt-2">
          Make sure the backend service is running on localhost:8000
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Container Management Demo</h2>
      <p className="text-gray-600 mb-4">
        Found {containers.length} containers
      </p>
      
      {containers.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded p-4">
          <p>No containers found. The API service is working correctly.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {containers.map((container) => (
            <div key={container.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{container.name}</h3>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  container.status === 'active' ? 'bg-green-100 text-green-800' :
                  container.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {container.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Type:</span> {container.type}
                </div>
                <div>
                  <span className="font-medium">Purpose:</span> {container.purpose}
                </div>
                <div>
                  <span className="font-medium">Tenant:</span> {container.tenant}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {container.location.city}, {container.location.country}
                </div>
              </div>
              
              {container.has_alert && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  ⚠️ This container has active alerts
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};