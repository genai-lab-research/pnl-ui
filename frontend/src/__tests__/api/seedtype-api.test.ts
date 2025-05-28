/**
 * Seed Type API Tests
 *
 * These tests verify that the seed type API endpoints work as expected.
 * They interact with the real API, so ensure the backend server is running.
 */
import { describe, expect, it } from 'vitest';

import seedTypeService from '../../services/seedTypeService';

// Test configuration
const API_URL = 'http://localhost:8000/api/v1';
const TEST_TIMEOUT = 10000; // 10 seconds

describe('Seed Type API', () => {
  describe('Seed type retrieval', () => {
    it(
      'should retrieve all seed types',
      async () => {
        const seedTypes = await seedTypeService.getSeedTypes();

        expect(seedTypes).toBeDefined();
        expect(Array.isArray(seedTypes)).toBe(true);

        // Check structure of seed types if any are returned
        if (seedTypes.length > 0) {
          const seedType = seedTypes[0];
          expect(seedType.id).toBeDefined();
          expect(typeof seedType.name).toBe('string');
          expect(typeof seedType.variety).toBe('string');
          expect(typeof seedType.supplier).toBe('string');
        }
      },
      TEST_TIMEOUT,
    );

    it(
      'should retrieve a specific seed type by ID if it exists',
      async () => {
        // First get any seed type to test with
        const seedTypes = await seedTypeService.getSeedTypes();

        if (seedTypes.length === 0) {
          console.log('No seed types available to test getSeedTypeById');
          return;
        }

        const seedTypeId = seedTypes[0].id;
        const seedType = await seedTypeService.getSeedTypeById(seedTypeId);

        expect(seedType).toBeDefined();
        expect(seedType.id).toBe(seedTypeId);
        expect(typeof seedType.name).toBe('string');
        expect(typeof seedType.variety).toBe('string');
        expect(typeof seedType.supplier).toBe('string');
      },
      TEST_TIMEOUT,
    );
  });
});
