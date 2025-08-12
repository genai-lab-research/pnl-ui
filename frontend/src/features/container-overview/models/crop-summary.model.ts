// Domain models for crops summary data
// Handles crop data processing and business logic

export interface CropSummaryItem {
  seed_type: string;
  nursery_station_count: number;
  cultivation_area_count: number;
  last_seeding_date: string | null;
  last_transplanting_date: string | null;
  last_harvesting_date: string | null;
  average_age: number;
  overdue_count: number;
}

export interface CropSummaryStats {
  totalCrops: number;
  totalNurseryStations: number;
  totalCultivationAreas: number;
  totalOverdue: number;
  averageAge: number;
}

export type CropSortField = 'seed_type' | 'nursery_station_count' | 'cultivation_area_count' | 
  'last_seeding_date' | 'last_transplanting_date' | 'last_harvesting_date' | 'average_age' | 'overdue_count';

export type SortDirection = 'asc' | 'desc';

export interface CropSortConfig {
  field: CropSortField;
  direction: SortDirection;
}

export interface CropFilterConfig {
  seedTypeFilter?: string;
  overdueOnly?: boolean;
  minAge?: number;
  maxAge?: number;
}

// Domain logic for crop summary management
export class CropSummaryModel {
  private crops: CropSummaryItem[] = [];
  private filteredCrops: CropSummaryItem[] = [];
  private sortConfig: CropSortConfig = { field: 'seed_type', direction: 'asc' };
  private filterConfig: CropFilterConfig = {};

  public setCrops(crops: CropSummaryItem[]): void {
    this.crops = crops;
    this.applyFiltersAndSort();
  }

  public getCrops(): CropSummaryItem[] {
    return this.filteredCrops;
  }

  public getAllCrops(): CropSummaryItem[] {
    return this.crops;
  }

  public setSortConfig(sortConfig: CropSortConfig): void {
    this.sortConfig = sortConfig;
    this.applyFiltersAndSort();
  }

  public getSortConfig(): CropSortConfig {
    return this.sortConfig;
  }

  public setFilterConfig(filterConfig: CropFilterConfig): void {
    this.filterConfig = filterConfig;
    this.applyFiltersAndSort();
  }

  public getFilterConfig(): CropFilterConfig {
    return this.filterConfig;
  }

  // Calculate summary statistics
  public getStats(): CropSummaryStats {
    return {
      totalCrops: this.crops.length,
      totalNurseryStations: this.crops.reduce((sum, crop) => sum + crop.nursery_station_count, 0),
      totalCultivationAreas: this.crops.reduce((sum, crop) => sum + crop.cultivation_area_count, 0),
      totalOverdue: this.crops.reduce((sum, crop) => sum + crop.overdue_count, 0),
      averageAge: this.crops.length > 0 
        ? Math.round(this.crops.reduce((sum, crop) => sum + crop.average_age, 0) / this.crops.length)
        : 0
    };
  }

  // Get unique seed types for filtering
  public getUniqueSeedTypes(): string[] {
    const seedTypes = this.crops.map(crop => crop.seed_type);
    return Array.from(new Set(seedTypes)).sort();
  }

  // Business logic for determining crop status
  public getCropStatus(crop: CropSummaryItem): 'healthy' | 'warning' | 'overdue' {
    if (crop.overdue_count > 0) return 'overdue';
    if (crop.average_age > 45) return 'warning'; // Business rule: crops over 45 days are concerning
    return 'healthy';
  }

  // Format dates for display
  public formatDate(dateString: string | null): string {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  }

  // Calculate days since last activity
  public getDaysSinceLastActivity(crop: CropSummaryItem): number {
    const dates = [
      crop.last_seeding_date,
      crop.last_transplanting_date,
      crop.last_harvesting_date
    ].filter(Boolean);
    
    if (dates.length === 0) return Infinity;
    
    const latestDate = new Date(Math.max(...dates.map(d => new Date(d!).getTime())));
    const now = new Date();
    return Math.floor((now.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Business logic for determining if intervention is needed
  public needsIntervention(crop: CropSummaryItem): boolean {
    return crop.overdue_count > 0 || this.getDaysSinceLastActivity(crop) > 14;
  }

  // Apply filters and sorting
  private applyFiltersAndSort(): void {
    let filtered = [...this.crops];

    // Apply filters
    if (this.filterConfig.seedTypeFilter) {
      filtered = filtered.filter(crop => 
        crop.seed_type.toLowerCase().includes(this.filterConfig.seedTypeFilter!.toLowerCase())
      );
    }

    if (this.filterConfig.overdueOnly) {
      filtered = filtered.filter(crop => crop.overdue_count > 0);
    }

    if (this.filterConfig.minAge !== undefined) {
      filtered = filtered.filter(crop => crop.average_age >= this.filterConfig.minAge!);
    }

    if (this.filterConfig.maxAge !== undefined) {
      filtered = filtered.filter(crop => crop.average_age <= this.filterConfig.maxAge!);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[this.sortConfig.field];
      const bValue = b[this.sortConfig.field];

      let comparison = 0;
      if (aValue === null && bValue === null) {
        comparison = 0;
      } else if (aValue === null) {
        comparison = 1;
      } else if (bValue === null) {
        comparison = -1;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return this.sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    this.filteredCrops = filtered;
  }
}
