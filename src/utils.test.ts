import { describe, it, expect } from 'vitest';
import { formatSlotName } from './utils';

describe('Utility Functions', () => {
  describe('formatSlotName', () => {
    it('should capitalize words and replace underscores with spaces', () => {
      expect(formatSlotName('rifle')).toBe('Rifle');
      expect(formatSlotName('infantry_support_slot')).toBe('Infantry Support Slot');
      expect(formatSlotName('heavy_tank_turret_slot')).toBe('Heavy Tank Turret Slot');
    });

    it('should handle empty strings', () => {
      expect(formatSlotName('')).toBe('');
    });
  });
});
