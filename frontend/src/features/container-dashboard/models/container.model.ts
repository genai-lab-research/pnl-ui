// Container Domain Model
// Pure domain logic for container entities

import { Container, Alert, SeedType, Location } from '../../../types/containers';

export class ContainerDomainModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly type: 'physical' | 'virtual',
    public readonly tenantId: number,
    public readonly purpose: 'development' | 'research' | 'production',
    public readonly status: 'created' | 'active' | 'maintenance' | 'inactive',
    public readonly location: Location | null,
    public readonly alerts: Alert[],
    public readonly seedTypes: SeedType[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly metrics: {
      yieldKg: number;
      spaceUtilizationPct: number;
      growthRate: number;
      healthScore: number;
    }
  ) {}

  static fromApiResponse(container: Container): ContainerDomainModel {
    return new ContainerDomainModel(
      container.id,
      container.name,
      container.type,
      container.tenant_id,
      container.purpose,
      container.status,
      container.location,
      container.alerts,
      container.seed_types,
      new Date(container.created_at),
      new Date(container.updated_at),
      {
        yieldKg: container.metrics.yield_kg,
        spaceUtilizationPct: container.metrics.space_utilization_pct,
        growthRate: container.metrics.growth_rate,
        healthScore: container.metrics.health_score
      }
    );
  }

  // Domain business logic
  hasActiveAlerts(): boolean {
    return this.alerts.some(alert => alert.active);
  }

  getActiveAlertsCount(): number {
    return this.alerts.filter(alert => alert.active).length;
  }

  getCriticalAlertsCount(): number {
    return this.alerts.filter(alert => alert.active && alert.severity === 'critical').length;
  }

  isPhysical(): boolean {
    return this.type === 'physical';
  }

  isVirtual(): boolean {
    return this.type === 'virtual';
  }

  isActive(): boolean {
    return this.status === 'active';
  }

  isHealthy(): boolean {
    return this.metrics.healthScore > 0.8 && !this.hasActiveAlerts();
  }

  getLocationDisplay(): string {
    if (!this.location) return 'No location';
    return `${this.location.city}, ${this.location.country}`;
  }

  getStatusColor(): string {
    switch (this.status) {
      case 'active':
        return this.hasActiveAlerts() ? 'orange' : 'green';
      case 'maintenance':
        return 'yellow';
      case 'inactive':
        return 'red';
      default:
        return 'gray';
    }
  }

  getEfficiencyScore(): number {
    // Weighted score based on yield and space utilization
    return (this.metrics.yieldKg * 0.6) + (this.metrics.spaceUtilizationPct * 0.4);
  }

  getDaysOld(): number {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getSeedTypesDisplay(): string {
    if (this.seedTypes.length === 0) return 'No seeds';
    if (this.seedTypes.length === 1) return this.seedTypes[0].name;
    return `${this.seedTypes[0].name} +${this.seedTypes.length - 1} more`;
  }
}
