# Inventory Components API Documentation

This document describes the implementation of the Container Inventory Page and its associated components, built to match the Figma design specifications.

## Overview

The inventory system provides a visual representation of crop management within container environments, displaying nursery station and cultivation area layouts with real-time utilization data.

## Components

### ContainerInventoryPage

Main page component that displays the container inventory interface with tabs for different views.

**Location**: `/src/pages/ContainerInventoryPage.tsx`

**Features**:
- Header with breadcrumb navigation and container information
- Tab switching between "Nursery Station" and "Cultivation Area"
- Real-time utilization progress meters
- Interactive tray grid with visual crop representations
- "Add Tray" functionality for empty slots

**Props**: None (uses URL parameters for container ID)

**Key State**:
- `viewMode`: 'nursery' | 'cultivation' - Controls which view is displayed
- `nurseryData`: NurseryStationData - Data for nursery station view
- `cultivationData`: CultivationAreaData - Data for cultivation area view

### TrayChart

Visual grid component representing crops in a tray with colored dots based on growth stage and health.

**Location**: `/src/shared/components/ui/TrayChart/TrayChart.tsx`

**Props**:
```typescript
interface TrayChartProps {
  data: CropData[];                    // Crop data to visualize
  gridSize: { rows: number; columns: number }; // Grid dimensions
  isHighlighted?: boolean;             // Whether to highlight (Today indicator)
  className?: string;                  // Custom CSS class
}
```

**Features**:
- 10x20 grid visualization (200 positions total)
- Color-coded dots:
  - Light green (#81C784): Small crops
  - Medium green (#4CAF50): Medium crops
  - Dark green (#2E7D32): Large crops
  - Orange (#FF9800): Treatment required
  - Red (#FF5733): To be disposed
  - Gray (#E0E0E0): Empty positions
- Optional highlighting border for "Today" indicator

### TrayValue

Compact component displaying tray ID and utilization percentage.

**Location**: `/src/shared/components/ui/TrayValue/TrayValue.tsx`

**Props**:
```typescript
interface TrayValueProps {
  trayId: string;                      // Tray identifier (e.g., "TR-15199256")
  utilizationPercentage: number;       // Utilization percentage (0-100)
  cropCount: number;                   // Number of crops in tray
  utilizationLevel: 'low' | 'medium' | 'high'; // Utilization level
  className?: string;                  // Custom CSS class
}
```

**Features**:
- Clean white background with subtle border
- Displays tray ID and percentage
- Consistent 100px minimum width
- 40px height for compact display

## API Integration

### Inventory Service

**Location**: `/src/services/inventoryService.ts`

**Methods**:

#### `getNurseryStationData(containerId: string, date?: string): Promise<NurseryStationData>`
Retrieves nursery station layout and tray data.

#### `getCultivationAreaData(containerId: string, date?: string): Promise<CultivationAreaData>`
Retrieves cultivation area layout and panel data.

#### `provisionTray(containerId: string, trayData: TrayCreate): Promise<TrayResponse>`
Provisions a new tray in the specified container location.

#### `provisionPanel(containerId: string, panelData: PanelCreate): Promise<PanelResponse>`
Provisions a new panel in the specified container location.

#### `getCropHistory(containerId: string, cropId: string, startDate?: string, endDate?: string): Promise<CropHistory>`
Retrieves crop history for time-lapse functionality.

## Data Types

### Core Types

```typescript
interface CropData {
  id: string;
  seed_type: string;
  row?: number;
  column?: number;
  age_days: number;
  seeded_date: string;
  planned_transplanting_date?: string;
  overdue_days: number;
  health_status: 'healthy' | 'treatment_required' | 'to_be_disposed';
  size: 'small' | 'medium' | 'large';
}

interface TrayData {
  id: string;
  utilization_percentage: number;
  crop_count: number;
  utilization_level: 'low' | 'medium' | 'high';
  rfid_tag: string;
  crops: CropData[];
}

interface NurseryStationData {
  utilization_percentage: number;
  upper_shelf: ShelfData;
  lower_shelf: ShelfData;
  off_shelf_trays: TrayData[];
}
```

## Navigation Integration

### Route Configuration

The inventory page is accessible via `/containers/:containerId/inventory` and integrates with the existing container management system.

**Router Configuration** (`/src/router/AppRouter.tsx`):
```typescript
<Route path="/containers/:containerId/inventory" element={<ContainerInventoryPage />} />
```

### Tab Navigation

- Clicking the "Inventory" tab in ContainerDetailsPage navigates to the inventory page
- The inventory page maintains the same header and tab structure
- Navigation back to other tabs returns to the main container details page

## Design Implementation

### Figma Alignment

The implementation closely follows the Figma design (node-id: 386-4924) with:

1. **Layout Structure**: Exact positioning of components and spacing
2. **Typography**: Consistent font sizes, weights, and colors
3. **Visual Elements**: 
   - Progress bars with green styling
   - Slot labels (SLOT 1, SLOT 2, etc.)
   - "Today" indicator positioning
   - Grid visualization with colored dots
4. **Color Scheme**: 
   - Green progress bars (#4CAF50)
   - Consistent gray text colors
   - Status-based color coding for crops

### Responsive Design

- Components adapt to different screen sizes
- Grid layouts use flexbox for proper spacing
- Progress meters maintain consistent appearance across breakpoints

## Mock Data

The inventory service includes comprehensive mock data for development:
- 8 slots per shelf (upper and lower)
- Realistic utilization percentages
- Generated crop data with proper row/column positioning
- Varied crop health statuses and sizes
- "Off shelf" tray examples

## Future Enhancements

1. **Time-lapse Controls**: Integration with timeline components for historical views
2. **Cultivation Area**: Full implementation of the cultivation area view
3. **Crop Interaction**: Click handlers for individual crops with detail popups
4. **Real-time Updates**: WebSocket integration for live data updates
5. **Drag & Drop**: Tray repositioning functionality

## Testing

The implementation includes:
- Component unit tests
- Integration tests for API services
- Mock service worker (MSW) handlers for API mocking
- TypeScript type checking for data consistency

## Performance Considerations

- Efficient grid rendering using React key optimization
- Memoized color calculations for crop visualization
- Lazy loading of historical data
- Optimized re-renders through proper state management