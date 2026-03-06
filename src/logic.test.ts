import { describe, it, expect, beforeEach } from 'vitest';
import { getOptionDefaultLabel, getChoicePointsLabel, getOptionPointsLabel } from './logic';
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
});
