// ViewModel for Crop Summary management
// Handles crop data, filtering, sorting, and statistics

import { 
  CropSummaryModel, 
  CropSummaryItem, 
  CropSortConfig, 
  CropFilterConfig,
  CropSummaryStats
} from '../models/crop-summary.model';
import { containerOverviewApiAdapter } from '../services/container-overview-api.adapter';

export interface CropSummaryState {
  crops: CropSummaryItem[];
  filteredCrops: CropSummaryItem[];
  stats: CropSummaryStats;
  sortConfig: CropSortConfig;
  filterConfig: CropFilterConfig;
  isLoading: boolean;
  error: string | null;
}

export class CropSummaryViewModel {
  private model: CropSummaryModel;
  private containerId: number;
  private onStateChange?: (state: CropSummaryState) => void;

  constructor(containerId: number) {
    this.containerId = containerId;
    this.model = new CropSummaryModel();
  }

  // State management
  public setStateChangeListener(callback: (state: CropSummaryState) => void): void {
    this.onStateChange = callback;
  }

  public getState(): CropSummaryState {
    return {
      crops: this.model.getAllCrops(),
      filteredCrops: this.model.getCrops(),
      stats: this.model.getStats(),
      sortConfig: this.model.getSortConfig(),
      filterConfig: this.model.getFilterConfig(),
      isLoading: false, // Managed by this viewmodel
      error: null // Managed by this viewmodel
    };
  }

  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  // Core operations
  public async initialize(): Promise<void> {
    try {
      this.notifyStateChange(); // Set loading state

      const overview = await containerOverviewApiAdapter.getContainerOverview(this.containerId);
      this.model.setCrops(overview.crops_summary);
      
      this.notifyStateChange();

    } catch (error) {
      console.error('Failed to initialize crop summary:', error);
      this.notifyStateChange();
    }
  }

  public async refreshData(): Promise<void> {
    await this.initialize();
  }

  // Sorting operations
  public setSortConfig(sortConfig: CropSortConfig): void {
    this.model.setSortConfig(sortConfig);
    this.notifyStateChange();
  }

  public toggleSort(field: CropSortConfig['field']): void {
    const currentSort = this.model.getSortConfig();
    
    const newDirection = currentSort.field === field && currentSort.direction === 'asc' 
      ? 'desc' 
      : 'asc';
    
    this.setSortConfig({ field, direction: newDirection });
  }

  public getSortIcon(field: CropSortConfig['field']): 'asc' | 'desc' | 'none' {
    const currentSort = this.model.getSortConfig();
    
    if (currentSort.field !== field) return 'none';
    return currentSort.direction;
  }

  // Filtering operations
  public setFilterConfig(filterConfig: CropFilterConfig): void {
    this.model.setFilterConfig(filterConfig);
    this.notifyStateChange();
  }

  public setSeedTypeFilter(seedType: string): void {
    const currentFilter = this.model.getFilterConfig();
    this.setFilterConfig({
      ...currentFilter,
      seedTypeFilter: seedType || undefined
    });
  }

  public setOverdueFilter(overdueOnly: boolean): void {
    const currentFilter = this.model.getFilterConfig();
    this.setFilterConfig({
      ...currentFilter,
      overdueOnly
    });
  }

  public setAgeRangeFilter(minAge?: number, maxAge?: number): void {
    const currentFilter = this.model.getFilterConfig();
    this.setFilterConfig({
      ...currentFilter,
      minAge,
      maxAge
    });
  }

  public clearFilters(): void {
    this.model.setFilterConfig({});
    this.notifyStateChange();
  }

  public hasActiveFilters(): boolean {
    const filter = this.model.getFilterConfig();
    return Boolean(
      filter.seedTypeFilter ||
      filter.overdueOnly ||
      filter.minAge !== undefined ||
      filter.maxAge !== undefined
    );
  }

  // UI data transformation
  public getFilteredCrops(): CropSummaryItem[] {
    return this.model.getCrops();
  }

  public getAllCrops(): CropSummaryItem[] {
    return this.model.getAllCrops();
  }

  public getStats(): CropSummaryStats {
    return this.model.getStats();
  }

  public getUniqueSeedTypes(): string[] {
    return this.model.getUniqueSeedTypes();
  }

  // Individual crop data transformation
  public getCropStatus(crop: CropSummaryItem): 'healthy' | 'warning' | 'overdue' {
    return this.model.getCropStatus(crop);
  }

  public getCropStatusColor(crop: CropSummaryItem): 'success' | 'warning' | 'error' {
    const status = this.getCropStatus(crop);
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'overdue':
        return 'error';
    }
  }

  public formatDate(dateString: string | null): string {
    return this.model.formatDate(dateString);
  }

  public getDaysSinceLastActivity(crop: CropSummaryItem): number {
    return this.model.getDaysSinceLastActivity(crop);
  }

  public needsIntervention(crop: CropSummaryItem): boolean {
    return this.model.needsIntervention(crop);
  }

  public getInterventionMessage(crop: CropSummaryItem): string | null {
    if (!this.needsIntervention(crop)) return null;

    if (crop.overdue_count > 0) {
      return `${crop.overdue_count} overdue tasks`;
    }

    const daysSinceActivity = this.getDaysSinceLastActivity(crop);
    if (daysSinceActivity > 14) {
      return `No activity for ${daysSinceActivity} days`;
    }

    return null;
  }

  // Table display helpers
  public getTableColumns() {
    return [
      { key: 'seed_type', label: 'Seed Type', sortable: true },
      { key: 'nursery_station_count', label: 'Nursery Station', sortable: true },
      { key: 'cultivation_area_count', label: 'Cultivation Area', sortable: true },
      { key: 'last_seeding_date', label: 'Last Seeding', sortable: true },
      { key: 'last_transplanting_date', label: 'Last Transplanting', sortable: true },
      { key: 'last_harvesting_date', label: 'Last Harvesting', sortable: true },
      { key: 'average_age', label: 'Average Age', sortable: true },
      { key: 'overdue_count', label: 'Overdue', sortable: true }
    ];
  }

  public getFormattedCropRow(crop: CropSummaryItem) {
    return {
      seedType: crop.seed_type,
      nurseryCount: crop.nursery_station_count.toString(),
      cultivationCount: crop.cultivation_area_count.toString(),
      lastSeeding: this.formatDate(crop.last_seeding_date),
      lastTransplanting: this.formatDate(crop.last_transplanting_date),
      lastHarvesting: this.formatDate(crop.last_harvesting_date),
      averageAge: `${crop.average_age} days`,
      overdueCount: crop.overdue_count > 0 ? crop.overdue_count.toString() : '-',
      status: this.getCropStatus(crop),
      statusColor: this.getCropStatusColor(crop),
      needsIntervention: this.needsIntervention(crop),
      interventionMessage: this.getInterventionMessage(crop)
    };
  }

  // Statistics and analytics
  public getFilteredStats(): CropSummaryStats {
    const filteredCrops = this.model.getCrops();
    
    return {
      totalCrops: filteredCrops.length,
      totalNurseryStations: filteredCrops.reduce((sum, crop) => sum + crop.nursery_station_count, 0),
      totalCultivationAreas: filteredCrops.reduce((sum, crop) => sum + crop.cultivation_area_count, 0),
      totalOverdue: filteredCrops.reduce((sum, crop) => sum + crop.overdue_count, 0),
      averageAge: filteredCrops.length > 0 
        ? Math.round(filteredCrops.reduce((sum, crop) => sum + crop.average_age, 0) / filteredCrops.length)
        : 0
    };
  }

  public getCropsNeedingIntervention(): CropSummaryItem[] {
    return this.model.getCrops().filter(crop => this.needsIntervention(crop));
  }

  public getCropsByStatus() {
    const crops = this.model.getCrops();
    
    return {
      healthy: crops.filter(crop => this.getCropStatus(crop) === 'healthy'),
      warning: crops.filter(crop => this.getCropStatus(crop) === 'warning'),
      overdue: crops.filter(crop => this.getCropStatus(crop) === 'overdue')
    };
  }

  // Export functionality
  public async exportCropsData(): Promise<string> {
    const crops = this.model.getCrops();
    const stats = this.getFilteredStats();
    
    return JSON.stringify({
      container_id: this.containerId,
      exported_at: new Date().toISOString(),
      filter_config: this.model.getFilterConfig(),
      sort_config: this.model.getSortConfig(),
      statistics: stats,
      crops: crops.map(crop => this.getFormattedCropRow(crop))
    }, null, 2);
  }

  // Search functionality
  public searchCrops(query: string): CropSummaryItem[] {
    if (!query.trim()) {
      return this.model.getCrops();
    }

    const searchTerm = query.toLowerCase();
    return this.model.getCrops().filter(crop =>
      crop.seed_type.toLowerCase().includes(searchTerm)
    );
  }

  // Error handling
  public hasError(): boolean {
    return false; // Error state would be managed here
  }

  public getErrorMessage(): string | null {
    return null; // Error message would be managed here
  }

  // Loading state
  public isLoading(): boolean {
    return false; // Loading state would be managed here
  }

  // Cleanup
  public destroy(): void {
    this.onStateChange = undefined;
  }
}
