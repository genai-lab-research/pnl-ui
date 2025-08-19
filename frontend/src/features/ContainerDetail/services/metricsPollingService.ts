// Real-time Metrics Polling Service for Container Detail
import { containerApiService } from '../../../api/containerApiService';
import { MetricSnapshot } from '../../../types/containers';
import { MetricPollingConfig, RealTimeMetricsState } from '../types';

/**
 * Service for polling real-time metrics data with exponential backoff
 */
export class MetricsPollingService {
  private intervalId: ReturnType<typeof setTimeout> | null = null;
  private retryCount = 0;
  private isPolling = false;
  private callbacks: Set<(metrics: MetricSnapshot[]) => void> = new Set();
  private errorCallbacks: Set<(error: Error) => void> = new Set();

  private defaultConfig: MetricPollingConfig = {
    enabled: true,
    interval: 30000, // 30 seconds
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
  };

  private config: MetricPollingConfig = { ...this.defaultConfig };
  private containerId: number | null = null;

  /**
   * Start polling metrics for a container
   */
  startPolling(containerId: number, config?: Partial<MetricPollingConfig>): void {
    this.stopPolling();
    
    this.containerId = containerId;
    this.config = { ...this.defaultConfig, ...config };
    this.retryCount = 0;
    this.isPolling = true;

    if (this.config.enabled) {
      this.scheduleNextPoll();
    }
  }

  /**
   * Stop polling metrics
   */
  stopPolling(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    this.isPolling = false;
    this.retryCount = 0;
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback: (metrics: MetricSnapshot[]) => void): () => void {
    this.callbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Subscribe to error notifications
   */
  subscribeToErrors(callback: (error: Error) => void): () => void {
    this.errorCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.errorCallbacks.delete(callback);
    };
  }

  /**
   * Get current polling state
   */
  getState(): RealTimeMetricsState {
    return {
      isPolling: this.isPolling,
      lastUpdate: this.lastUpdate,
      updateCount: this.updateCount,
      config: this.config,
    };
  }

  /**
   * Update polling configuration
   */
  updateConfig(newConfig: Partial<MetricPollingConfig>): void {
    const wasPolling = this.isPolling;
    
    if (wasPolling) {
      this.stopPolling();
    }

    this.config = { ...this.config, ...newConfig };

    if (wasPolling && this.containerId) {
      this.startPolling(this.containerId);
    }
  }

  /**
   * Force an immediate metrics update
   */
  async forceUpdate(): Promise<void> {
    if (!this.containerId) {
      throw new Error('No container ID set for polling');
    }

    await this.pollMetrics();
  }

  /**
   * Check if polling is active
   */
  isActive(): boolean {
    return this.isPolling;
  }

  // Private implementation

  private lastUpdate: string | null = null;
  private updateCount = 0;

  private scheduleNextPoll(): void {
    if (!this.isPolling) return;

    const delay = this.retryCount > 0 
      ? this.config.retryDelay * Math.pow(2, this.retryCount - 1) // Exponential backoff
      : this.config.interval;

    this.intervalId = setTimeout(() => {
      this.pollMetrics();
    }, delay);
  }

  private async pollMetrics(): Promise<void> {
    if (!this.containerId || !this.isPolling) return;

    try {
      // Get metrics from last 2 data points for trend calculation
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - this.config.interval * 2).toISOString();

      const metrics = await containerApiService.getMetricSnapshots(
        this.containerId,
        startDate,
        endDate,
        'hour'
      );

      // Success - reset retry count and notify subscribers
      this.retryCount = 0;
      this.lastUpdate = new Date().toISOString();
      this.updateCount++;

      this.notifySubscribers(metrics);
      
      // Schedule next poll
      if (this.isPolling) {
        this.scheduleNextPoll();
      }

    } catch (error) {
      console.error('Metrics polling error:', error);
      
      this.retryCount++;
      
      if (this.retryCount <= this.config.maxRetries) {
        // Retry with exponential backoff
        if (this.isPolling) {
          this.scheduleNextPoll();
        }
      } else {
        // Max retries reached - stop polling and notify error
        this.stopPolling();
        this.notifyErrorSubscribers(error as Error);
      }
    }
  }

  private notifySubscribers(metrics: MetricSnapshot[]): void {
    this.callbacks.forEach(callback => {
      try {
        callback(metrics);
      } catch (error) {
        console.error('Error in metrics polling callback:', error);
      }
    });
  }

  private notifyErrorSubscribers(error: Error): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('Error in metrics polling error callback:', callbackError);
      }
    });
  }
}

// Create and export singleton instance
export const metricsPollingService = new MetricsPollingService();
