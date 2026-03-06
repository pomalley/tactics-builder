import { describe, it, expect, beforeEach } from 'vitest';
import {
  getOptionDefaultLabel,
  getChoicePointsLabel,
  getOptionPointsLabel,
  formatStats,
  getChoiceStatsLabel,
  getOptionStatsLabel,
} from './logic';
import type { Unit, UnitOptionDef } from './types';

describe('Logic Helpers', () => {
  let mockUnit: Unit;

  beforeEach(() => {
    mockUnit = {
      id: 'u1',
      name: 'Test Unit',
      type: 'Infantry',
      lifeform: 'Human',
      selectedOptions: [],
      models: [
        {
          id: 'm1',
          name: 'Sergeant',
          lifeform: 'Human',
          class: 'Minor Character',
          slots: { rifle: 'Military Rifle' },
          extras: ['Frag Grenade'],
        },
      ],
      slots: { squad_weapon: 'Laser Cannon' },
      extras: [],
    };
  });

  describe('formatStats', () => {
    it('returns empty string for unknown equipment', () => {
      expect(formatStats('Unknown Item')).toBe('');
    });

    it('formats weapon with range, shots, and damage', () => {
      // Military Rifle: { points: 3, weapon: { range: 24, shots: 1, damage: 0 }, traits: [] }
      expect(formatStats('Military Rifle')).toBe(' - 24" S1 D0');
    });

    it('formats weapon with bonus damage', () => {
      // Laser Cannon: { points: 35, weapon: { range: 48, shots: 1, damage: 5, bonusDamage: 3 }, traits: ['Crewed'] }
      expect(formatStats('Laser Cannon')).toBe(' - 48" S1 D5(x3) Crewed');
    });

    it('formats weapon with null shots or damage', () => {
      // Grenade Launcher: { points: 10, weapon: { range: 24, shots: null, damage: null }, traits: ['Launcher', 'Heavy', 'Team'] }
      expect(formatStats('Grenade Launcher')).toBe(' - 24" S- D- Launcher • Heavy • Team');
    });

    it('formats equipment with only traits', () => {
      // Powered Armor: { points: 2, traits: ['6+ Save'] }
      expect(formatStats('Powered Armor')).toBe(' - 6+ Save');
    });

    it('formats melee weapon (null range)', () => {
      // Blade: { points: 1, weapon: { range: null, shots: null, damage: 1 }, traits: ['Melee'] }
      expect(formatStats('Blade')).toBe(' - S- D1 Melee');
    });
  });

  describe('getOptionDefaultLabel', () => {
    it('returns correct label for unit-level slots', () => {
      const opt: UnitOptionDef = {
        id: 'o1',
        name: 'Squad Weapon',
        type: 'slot',
        slotName: 'squad_weapon',
      };
      // Laser Cannon is 35 pts
      expect(getOptionDefaultLabel(opt, mockUnit)).toBe(
        'Default (Laser Cannon [35] - 48" S1 D5(x3) Crewed)'
      );
    });

    it('returns correct label for model-level slots via opt.slotName', () => {
      const opt: UnitOptionDef = {
        id: 'o1',
        name: 'Rifle',
        type: 'slot',
        slotName: 'rifle',
      };
      // Military Rifle is 3 pts
      expect(getOptionDefaultLabel(opt, mockUnit)).toBe('Default (Military Rifle [3] - 24" S1 D0)');
    });

    it('returns correct label for model-level slots via modification target', () => {
      const opt: UnitOptionDef = {
        id: 'o1',
        name: 'Sergeant Weapon',
        choices: [
          {
            id: 'c1',
            name: 'Plasma Rifle',
            modifications: [{ targetName: 'Sergeant', setSlot: { rifle: 'Plasma Rifle' } }],
          },
        ],
      };
      expect(getOptionDefaultLabel(opt, mockUnit)).toBe('Default (Military Rifle [3] - 24" S1 D0)');
    });

    it('returns (Default / None) if no slot found', () => {
      const opt: UnitOptionDef = {
        id: 'o1',
        name: 'Unknown',
        type: 'slot',
        slotName: 'nonexistent',
      };
      expect(getOptionDefaultLabel(opt, mockUnit)).toBe('(Default / None)');
    });
  });

  describe('getChoicePointsLabel', () => {
    it('returns points label for equipment name', () => {
      const choice = { name: 'Military Rifle' };
      expect(getChoicePointsLabel(choice)).toBe(' [3]');
    });

    it('returns points label from modifications', () => {
      const choice = {
        modifications: [{ setSlot: { rifle: 'Plasma Rifle' } }],
      };
      expect(getChoicePointsLabel(choice)).toBe(' [8]');
    });

    it('returns empty string for unknown equipment', () => {
      const choice = { name: 'Super Gun' };
      expect(getChoicePointsLabel(choice)).toBe('');
    });
  });

  describe('getChoiceStatsLabel', () => {
    it('returns stats label for equipment name', () => {
      const choice = { name: 'Military Rifle' };
      expect(getChoiceStatsLabel(choice)).toBe(' - 24" S1 D0');
    });

    it('returns stats label from modifications', () => {
      const choice = {
        modifications: [{ setSlot: { rifle: 'Plasma Rifle' } }],
      };
      // Plasma Rifle: { points: 8, weapon: { range: 20, shots: 2, damage: 1 }, traits: ['Focused', 'Piercing', 'Overheat', 'Team'] }
      expect(getChoiceStatsLabel(choice)).toBe(' - 20" S2 D1 Focused • Piercing • Overheat • Team');
    });
  });

  describe('getOptionPointsLabel', () => {
    it('returns points label for simple extra addition', () => {
      const opt: UnitOptionDef = {
        id: 'o1',
        name: 'Add Grenades',
        modifications: [{ addExtras: ['Frag Grenade', 'Fog Grenade'] }],
      };
      // 1 + 1 = 2
      expect(getOptionPointsLabel(opt)).toBe(' [2]');
    });

    it('returns points label for slot override', () => {
      const opt: UnitOptionDef = {
        id: 'o1',
        name: 'Heavy Weapon',
        modifications: [{ setSlot: { heavy: 'Laser Cannon' } }],
      };
      expect(getOptionPointsLabel(opt)).toBe(' [35]');
    });

    it('returns empty string for option with choices', () => {
      const opt: UnitOptionDef = {
        id: 'o1',
        name: 'Choose',
        choices: [{ id: 'c1', name: 'Choice' }],
      };
      expect(getOptionPointsLabel(opt)).toBe('');
    });
  });

  describe('getOptionStatsLabel', () => {
    it('returns stats label for modifications', () => {
      const opt: UnitOptionDef = {
        id: 'o1',
        name: 'Upgrade',
        modifications: [{ addExtras: ['Frag Grenade'] }, { setSlot: { rifle: 'Military Rifle' } }],
      };
      // Frag Grenade: - 6" S- D0 Area
      // Military Rifle: - 24" S1 D0
      expect(getOptionStatsLabel(opt)).toBe(' - 6" S- D0 Area, 24" S1 D0');
    });

    it('returns empty string for option with choices', () => {
      const opt: UnitOptionDef = {
        id: 'o1',
        name: 'Choose',
        choices: [{ id: 'c1', name: 'Choice' }],
      };
      expect(getOptionStatsLabel(opt)).toBe('');
    });
  });
});
