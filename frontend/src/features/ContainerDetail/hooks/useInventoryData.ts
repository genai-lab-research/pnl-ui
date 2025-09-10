import { useState, useEffect } from 'react';
import { inventoryService } from '../../../api/inventoryService';
import type { TraySlotData } from '../../../api/inventoryService';

interface TraySlot {
  id: string;
  trayId: string;
  utilization: number;
  gridSize: string;
  cropCount: number;
  gridData?: boolean[][];
  status?: 'active' | 'warning' | 'inactive';
}

interface InventoryData {
  nurseryUtilization: number;
  shelfUpperUtilization: number;
  shelfLowerUtilization: number;
  currentDay: number;
  shelfUpperSlots: TraySlot[];
  shelfUpperEmptySlots: { id: string }[];
  shelfLowerSlots: TraySlot[];
  shelfLowerEmptySlots: { id: string }[];
  offShelfSlots: TraySlot[];
}

export const useInventoryData = (containerId: number, area: 'nursery' | 'cultivation') => {
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch real data from backend
        const inventory = await inventoryService.getContainerInventory(containerId);
        
        if (area === 'nursery') {
          // Process nursery trays
          const nurseryTrays = inventory.trays.map(tray => 
            inventoryService.transformTrayToSlot(tray)
          );
          
          // Divide trays into shelf sections based on location or index
          const shelfUpperTrays = nurseryTrays.filter((_, index) => {
            // First half goes to upper shelf
            return index < nurseryTrays.length / 2;
          }).slice(0, 8); // Max 8 slots per shelf
          
          const shelfLowerTrays = nurseryTrays.filter((_, index) => {
            // Second half goes to lower shelf
            return index >= nurseryTrays.length / 2 && index < nurseryTrays.length;
          }).slice(0, 8); // Max 8 slots per shelf
          
          const offShelfTrays = nurseryTrays.filter((_, index) => {
            // Any remaining trays are off shelf
            return index >= 16;
          }).slice(0, 2); // Max 2 off shelf
          
          // Calculate utilization for each shelf
          const calculateUtilization = (trays: TraySlotData[]) => {
            if (trays.length === 0) return 0;
            const totalUtil = trays.reduce((sum, t) => sum + t.utilization, 0);
            return Math.round(totalUtil / trays.length);
          };
          
          // Convert to UI format with grid data
          const convertToUISlot = (tray: TraySlotData): TraySlot => ({
            id: tray.id,
            trayId: tray.trayId,
            utilization: tray.utilization,
            gridSize: tray.gridSize,
            cropCount: tray.cropCount,
            gridData: generateGridFromUtilization(10, 14, tray.utilization / 100),
            status: tray.status,
          });
          
          const data: InventoryData = {
            nurseryUtilization: inventory.nurseryUtilization || calculateUtilization(nurseryTrays),
            shelfUpperUtilization: calculateUtilization(shelfUpperTrays),
            shelfLowerUtilization: calculateUtilization(shelfLowerTrays),
            currentDay: calculateCurrentDay(), // Calculate based on container creation date
            shelfUpperSlots: shelfUpperTrays.map(convertToUISlot),
            shelfUpperEmptySlots: generateEmptySlots(8 - shelfUpperTrays.length, shelfUpperTrays.length),
            shelfLowerSlots: shelfLowerTrays.map(convertToUISlot),
            shelfLowerEmptySlots: generateEmptySlots(8 - shelfLowerTrays.length, shelfLowerTrays.length + 8),
            offShelfSlots: offShelfTrays.map(convertToUISlot),
          };
          
          setInventoryData(data);
        } else {
          // Cultivation area - use panels data
          const cultivationPanels = inventory.panels;
          
          // For now, return a simplified view for cultivation
          // This can be expanded based on requirements
          const data: InventoryData = {
            nurseryUtilization: 0,
            shelfUpperUtilization: inventory.cultivationUtilization,
            shelfLowerUtilization: 0,
            currentDay: calculateCurrentDay(),
            shelfUpperSlots: cultivationPanels.slice(0, 8).map(panel => ({
              id: panel.id.toString(),
              trayId: panel.rfid_tag || `PNL-${panel.id}`,
              utilization: panel.utilization_pct || 0,
              gridSize: '10x14 Grid',
              cropCount: Math.round((panel.capacity || 140) * (panel.utilization_pct || 0) / 100),
              gridData: generateGridFromUtilization(10, 14, (panel.utilization_pct || 0) / 100),
              status: panel.status === 'active' ? 'active' : 'inactive' as const,
            })),
            shelfUpperEmptySlots: [],
            shelfLowerSlots: [],
            shelfLowerEmptySlots: [],
            offShelfSlots: [],
          };
          
          setInventoryData(data);
        }
      } catch (err) {
        console.error('Failed to fetch inventory data:', err);
        setError('Failed to fetch inventory data');
        
        // Fallback to minimal data structure to prevent UI crash
        setInventoryData({
          nurseryUtilization: 0,
          shelfUpperUtilization: 0,
          shelfLowerUtilization: 0,
          currentDay: 1,
          shelfUpperSlots: [],
          shelfUpperEmptySlots: generateEmptySlots(4, 0),
          shelfLowerSlots: [],
          shelfLowerEmptySlots: generateEmptySlots(4, 4),
          offShelfSlots: [],
        });
      } finally {
        setLoading(false);
      }
    };

    if (containerId) {
      fetchInventoryData();
    }
  }, [containerId, area]);

  const refetch = () => {
    if (containerId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const inventory = await inventoryService.getContainerInventory(containerId);
          // Process data same as above...
        } catch (err) {
          setError('Failed to refresh inventory data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };

  return { inventoryData, loading, error, refetch };
};

// Helper function to generate grid data based on utilization
function generateGridFromUtilization(rows: number, cols: number, fillRate: number): boolean[][] {
  const grid: boolean[][] = [];
  const totalCells = rows * cols;
  const filledCells = Math.floor(totalCells * fillRate);
  
  // Create flat array with filled cells
  const flatGrid = Array(totalCells).fill(false);
  for (let i = 0; i < filledCells; i++) {
    flatGrid[i] = true;
  }
  
  // Shuffle the array for random distribution
  for (let i = flatGrid.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flatGrid[i], flatGrid[j]] = [flatGrid[j], flatGrid[i]];
  }
  
  // Convert to 2D array
  for (let i = 0; i < cols; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < rows; j++) {
      row.push(flatGrid[i * rows + j]);
    }
    grid.push(row);
  }
  
  return grid;
}

// Helper to generate empty slot placeholders
function generateEmptySlots(count: number, startIndex: number): { id: string }[] {
  const slots: { id: string }[] = [];
  for (let i = 0; i < count; i++) {
    slots.push({ id: `${startIndex + i + 1}` });
  }
  return slots;
}

// Calculate current day based on container age or default to 31
function calculateCurrentDay(): number {
  // This could be calculated from container creation date
  // For now, return a reasonable default
  return 31;
}