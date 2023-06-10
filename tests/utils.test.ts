import { describe, it, expect } from 'vitest';
import { calculateDistance } from '../src/utils';

describe('calculateDistance', () => {
    it('should calculate the distance between two points', () => {
        const lat1 = 43.6532;
        const lon1 = -79.3832;
        const lat2 = 45.5017;
        const lon2 = -73.5673;
        const expectedDistance = 504.262 * 1000; // distance between Toronto and Montreal in meters

        const distance = calculateDistance(lat1, lon1, lat2, lon2);

        expect(distance).toBeCloseTo(expectedDistance, -2); // allow for 2% error
    });
});