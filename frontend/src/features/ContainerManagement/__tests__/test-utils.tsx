import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { act } from '@testing-library/react';

// Performance monitoring hook
export const useRenderCounter = () => {
  const renderCount = React.useRef(0);
  renderCount.current += 1;
  return renderCount.current;
};

// Component wrapper for render tracking
export const withRenderTracking = <P extends object>(
  Component: React.ComponentType<P>,
  onRender?: (count: number) => void
) => {
  return (props: P) => {
    const renderCount = useRenderCounter();
    React.useEffect(() => {
      onRender?.(renderCount);
    });
    return <Component {...props} />;
  };
};

// API call tracker
export class ApiCallTracker {
  private calls: Map<string, Array<{ timestamp: number; args: any[] }>> = new Map();
  private pendingCalls: Set<string> = new Set();

  track(method: string, ...args: any[]) {
    if (!this.calls.has(method)) {
      this.calls.set(method, []);
    }
    this.calls.get(method)!.push({ timestamp: Date.now(), args });
  }

  startPending(method: string) {
    this.pendingCalls.add(method);
  }

  endPending(method: string) {
    this.pendingCalls.delete(method);
  }

  isPending(method: string): boolean {
    return this.pendingCalls.has(method);
  }

  getCallCount(method: string): number {
    return this.calls.get(method)?.length || 0;
  }

  getCalls(method: string) {
    return this.calls.get(method) || [];
  }

  getTotalCalls(): number {
    return Array.from(this.calls.values()).reduce((sum, calls) => sum + calls.length, 0);
  }

  getConcurrentCalls(method: string): number {
    const calls = this.getCalls(method);
    let maxConcurrent = 0;
    let currentConcurrent = 0;

    const events = calls.flatMap(call => [
      { time: call.timestamp, type: 'start' },
      { time: call.timestamp + 100, type: 'end' } // Assume 100ms duration
    ]).sort((a, b) => a.time - b.time);

    for (const event of events) {
      if (event.type === 'start') {
        currentConcurrent++;
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
      } else {
        currentConcurrent--;
      }
    }

    return maxConcurrent;
  }

  reset() {
    this.calls.clear();
    this.pendingCalls.clear();
  }
}

// State stability tracker
export class StateStabilityTracker {
  private stateSnapshots: Map<string, any[]> = new Map();
  private updateTimestamps: Map<string, number[]> = new Map();

  trackState(key: string, value: any) {
    if (!this.stateSnapshots.has(key)) {
      this.stateSnapshots.set(key, []);
      this.updateTimestamps.set(key, []);
    }
    this.stateSnapshots.get(key)!.push(JSON.parse(JSON.stringify(value)));
    this.updateTimestamps.get(key)!.push(Date.now());
  }

  getUpdateCount(key: string): number {
    return this.stateSnapshots.get(key)?.length || 0;
  }

  getUpdateFrequency(key: string): number {
    const timestamps = this.updateTimestamps.get(key);
    if (!timestamps || timestamps.length < 2) return 0;

    const duration = timestamps[timestamps.length - 1] - timestamps[0];
    return (timestamps.length - 1) / (duration / 1000); // Updates per second
  }

  hasRedundantUpdates(key: string): boolean {
    const snapshots = this.stateSnapshots.get(key);
    if (!snapshots || snapshots.length < 2) return false;

    for (let i = 1; i < snapshots.length; i++) {
      if (JSON.stringify(snapshots[i]) === JSON.stringify(snapshots[i - 1])) {
        return true;
      }
    }
    return false;
  }

  getStateHistory(key: string) {
    return this.stateSnapshots.get(key) || [];
  }

  reset() {
    this.stateSnapshots.clear();
    this.updateTimestamps.clear();
  }
}

// Custom render with performance tracking
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  apiTracker?: ApiCallTracker;
  stateTracker?: StateStabilityTracker;
  renderTracker?: { count: number };
}

export const renderWithTracking = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
): RenderResult & {
  apiTracker: ApiCallTracker;
  stateTracker: StateStabilityTracker;
  getRenderCount: () => number;
} => {
  const apiTracker = options?.apiTracker || new ApiCallTracker();
  const stateTracker = options?.stateTracker || new StateStabilityTracker();
  const renderTracker = options?.renderTracker || { count: 0 };

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    React.useEffect(() => {
      renderTracker.count++;
    });
    return <>{children}</>;
  };

  const result = render(<Wrapper>{ui}</Wrapper>, options);

  return {
    ...result,
    apiTracker,
    stateTracker,
    getRenderCount: () => renderTracker.count
  };
};

// Wait for stable state (no updates for specified duration)
export const waitForStableState = async (
  checkFn: () => boolean,
  timeout = 1000,
  checkInterval = 50
): Promise<void> => {
  const startTime = Date.now();
  let lastChangeTime = startTime;
  let lastValue = checkFn();

  while (Date.now() - startTime < timeout) {
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    });

    const currentValue = checkFn();
    if (currentValue !== lastValue) {
      lastChangeTime = Date.now();
      lastValue = currentValue;
    } else if (Date.now() - lastChangeTime > 200) {
      // Stable for 200ms
      return;
    }
  }

  throw new Error('State did not stabilize within timeout');
};

// Performance benchmark helper
export const measurePerformance = async (
  testFn: () => Promise<void>,
  iterations = 5
): Promise<{
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  stdDev: number;
}> => {
  const durations: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await testFn();
    const duration = performance.now() - start;
    durations.push(duration);
  }

  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  
  const variance = durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length;
  const stdDev = Math.sqrt(variance);

  return { avgDuration, minDuration, maxDuration, stdDev };
};

// Mock API delay simulator
export function createDelayedMockResponse<T>(
  response: T,
  delay: number,
  options?: {
    jitter?: boolean;
    failureRate?: number;
  }
): Promise<T> {
  return new Promise((resolve, reject) => {
    const actualDelay = options?.jitter 
      ? delay + (Math.random() - 0.5) * delay * 0.2 
      : delay;

    const shouldFail = options?.failureRate && Math.random() < options.failureRate;

    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Simulated API failure'));
      } else {
        resolve(response);
      }
    }, actualDelay);
  });
}

// Debounce test helper
export const testDebounce = async (
  triggerFn: () => void,
  checkFn: () => number,
  expectedCalls: number,
  debounceTime: number
) => {
  const initialCalls = checkFn();

  // Trigger multiple times rapidly
  for (let i = 0; i < 5; i++) {
    triggerFn();
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, debounceTime / 3));
    });
  }

  // Wait for debounce period
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, debounceTime + 100));
  });

  const finalCalls = checkFn();
  expect(finalCalls - initialCalls).toBe(expectedCalls);
};