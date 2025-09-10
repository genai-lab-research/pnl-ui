import { Tray, Panel } from '../types/containers';
import { tokenStorage } from '../utils/tokenStorage';
import { getApiBaseUrl } from '../utils/env';

export interface InventoryData {
  trays: Tray[];
  panels: Panel[];
  nurseryUtilization: number;
  cultivationUtilization: number;
  totalCapacity: number;
  usedCapacity: number;
}

export interface TraySlotData {
  id: string;
  trayId: string;
  rfidTag: string;
  utilization: number;
  gridSize: string;
  cropCount: number;
  status: 'active' | 'warning' | 'inactive';
  location: any;
  capacity: number;
}

export class InventoryService {
  private baseURL: string;
  private static instance: InventoryService;

  private constructor(baseURL: string = '') {
    this.baseURL = baseURL || getApiBaseUrl();
  }

  public static getInstance(baseURL?: string): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService(baseURL);
    }
    return InventoryService.instance;
  }

  private getHeaders(): HeadersInit {
    const token = tokenStorage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Get trays for a specific container
   */
  public async getContainerTrays(containerId: number): Promise<Tray[]> {
    try {
      const response = await fetch(`${this.baseURL}/containers/${containerId}/trays`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // If endpoint doesn't exist, return empty array
          return [];
        }
        throw new Error(`Failed to fetch trays: ${response.statusText}`);
      }

      const data = await response.json();
      return data.trays || data || [];
    } catch (error) {
      console.error('Error fetching container trays:', error);
      // Return empty array on error to avoid breaking the UI
      return [];
    }
  }

  /**
   * Get panels for a specific container
   */
  public async getContainerPanels(containerId: number): Promise<Panel[]> {
    try {
      const response = await fetch(`${this.baseURL}/containers/${containerId}/panels`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // If endpoint doesn't exist, return empty array
          return [];
        }
        throw new Error(`Failed to fetch panels: ${response.statusText}`);
      }

      const data = await response.json();
      return data.panels || data || [];
    } catch (error) {
      console.error('Error fetching container panels:', error);
      // Return empty array on error to avoid breaking the UI
      return [];
    }
  }

  /**
   * Get inventory summary for a container
   */
  public async getContainerInventory(containerId: number): Promise<InventoryData> {
    try {
      // Fetch trays and panels in parallel
      const [trays, panels] = await Promise.all([
        this.getContainerTrays(containerId),
        this.getContainerPanels(containerId),
      ]);

      // Calculate utilization metrics
      const nurseryTrays = trays.filter(t => t.location?.area === 'nursery' || t.tray_type === 'nursery');
      const cultivationPanels = panels.filter(p => p.location?.area === 'cultivation' || p.panel_type === 'cultivation');

      const nurseryUtilization = nurseryTrays.length > 0
        ? Math.round(nurseryTrays.reduce((sum, t) => sum + (t.utilization_pct || 0), 0) / nurseryTrays.length)
        : 0;

      const cultivationUtilization = cultivationPanels.length > 0
        ? Math.round(cultivationPanels.reduce((sum, p) => sum + (p.utilization_pct || 0), 0) / cultivationPanels.length)
        : 0;

      const totalCapacity = trays.reduce((sum, t) => sum + (t.capacity || 0), 0) + 
                           panels.reduce((sum, p) => sum + (p.capacity || 0), 0);
      
      const usedCapacity = Math.round(totalCapacity * ((nurseryUtilization + cultivationUtilization) / 200));

      return {
        trays,
        panels,
        nurseryUtilization,
        cultivationUtilization,
        totalCapacity,
        usedCapacity,
      };
    } catch (error) {
      console.error('Error fetching container inventory:', error);
      // Return default values on error
      return {
        trays: [],
        panels: [],
        nurseryUtilization: 0,
        cultivationUtilization: 0,
        totalCapacity: 0,
        usedCapacity: 0,
      };
    }
  }

  /**
   * Transform tray data for UI display
   */
  public transformTrayToSlot(tray: Tray): TraySlotData {
    return {
      id: tray.id.toString(),
      trayId: tray.rfid_tag || `TR-${tray.id}`,
      rfidTag: tray.rfid_tag,
      utilization: tray.utilization_pct || 0,
      gridSize: '10x14 Grid', // Default grid size
      cropCount: Math.round((tray.capacity || 140) * (tray.utilization_pct || 0) / 100),
      status: this.getTrayStatus(tray),
      location: tray.location,
      capacity: tray.capacity || 140,
    };
  }

  /**
   * Determine tray status based on utilization and other factors
   */
  private getTrayStatus(tray: Tray): 'active' | 'warning' | 'inactive' {
    if (tray.status === 'inactive' || tray.utilization_pct === 0) {
      return 'inactive';
    }
    if (tray.utilization_pct < 50 || tray.status === 'warning') {
      return 'warning';
    }
    return 'active';
  }
}

// Export singleton instance
export const inventoryService = InventoryService.getInstance();

// Export convenience methods
export const getContainerInventory = (containerId: number) => 
  inventoryService.getContainerInventory(containerId);

export const getContainerTrays = (containerId: number) => 
  inventoryService.getContainerTrays(containerId);

export const getContainerPanels = (containerId: number) => 
  inventoryService.getContainerPanels(containerId);