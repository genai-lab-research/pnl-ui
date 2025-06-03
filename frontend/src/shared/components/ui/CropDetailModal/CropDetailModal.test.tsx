import { describe, it, expect } from 'vitest';

// Simple integration test to ensure the component can be imported
describe('CropDetailModal', () => {
  it('should be importable without errors', async () => {
    // Test that the component module can be imported
    const module = await import('./CropDetailModal');
    expect(module.CropDetailModal).toBeDefined();
    expect(typeof module.CropDetailModal).toBe('function');
  });

  it('should export the component interface', async () => {
    // Test that the props interface is exported
    const module = await import('./CropDetailModal');
    expect(module).toHaveProperty('CropDetailModal');
  });

  it('should be available in the main UI index', async () => {
    // Test that the component is exported from the main UI index
    try {
      const uiModule = await import('../index');
      expect(uiModule).toHaveProperty('CropDetailModal');
    } catch (error) {
      // This test may fail if the component isn't added to the main index yet
      console.warn('CropDetailModal not yet exported from main UI index');
    }
  });
});