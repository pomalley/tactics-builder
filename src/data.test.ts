import { describe, it, expect } from 'vitest';
import { unitDefinitions, unitOptions } from './data/units';
import { equipmentPoints, equipmentDefinitions } from './data/equipment';

describe('Data Integrity', () => {
  it('should have valid equipment definitions', () => {
    for (const [name, def] of Object.entries(equipmentDefinitions)) {
      expect(def).toHaveProperty('points');
      expect(typeof def.points).toBe('number');
      if (def.weapon) {
        expect(def.weapon).toHaveProperty('range');
        expect(def.weapon).toHaveProperty('shots');
        expect(def.weapon).toHaveProperty('damage');
      }
      if (def.traits) {
        expect(Array.isArray(def.traits)).toBe(true);
      }
      // Check that equipmentPoints matches
      expect(equipmentPoints[name as keyof typeof equipmentDefinitions]).toBe(def.points);
    }
  });

  it('should have point values for all equipment in unit definitions', () => {
    for (const [, def] of Object.entries(unitDefinitions)) {
      // Check unit-level slots
      if (def.slots) {
        for (const item of Object.values(def.slots)) {
          expect(equipmentPoints).toHaveProperty(item as string);
        }
      }
      // Check unit-level extras
      if (def.extras) {
        for (const item of def.extras) {
          expect(equipmentPoints).toHaveProperty(item);
        }
      }
      // Check model-level slots and extras
      for (const model of def.models) {
        for (const item of Object.values(model.slots)) {
          expect(equipmentPoints).toHaveProperty(item as string);
        }
        for (const item of model.extras) {
          expect(equipmentPoints).toHaveProperty(item);
        }
      }
    }
  });

  it('should have point values for all equipment in unit options', () => {
    for (const options of Object.values(unitOptions)) {
      for (const option of options) {
        // Check choices
        if (option.choices) {
          for (const choice of option.choices) {
            // Choice names (for slot type options)
            if (option.type === 'slot' && choice.name) {
              expect(equipmentPoints).toHaveProperty(choice.name);
            }
            // Choice modifications
            if (choice.modifications) {
              for (const mod of choice.modifications) {
                if (mod.setSlot) {
                  for (const item of Object.values(mod.setSlot)) {
                    expect(equipmentPoints).toHaveProperty(item);
                  }
                }
                if (mod.setUnitSlot) {
                  for (const item of Object.values(mod.setUnitSlot)) {
                    expect(equipmentPoints).toHaveProperty(item);
                  }
                }
                if (mod.addExtras) {
                  for (const item of mod.addExtras) {
                    expect(equipmentPoints).toHaveProperty(item);
                  }
                }
                if (mod.addUnitExtras) {
                  for (const item of mod.addUnitExtras) {
                    expect(equipmentPoints).toHaveProperty(item);
                  }
                }
              }
            }
          }
        }
        // Option modifications
        if (option.modifications) {
          for (const mod of option.modifications) {
            if (mod.setSlot) {
              for (const item of Object.values(mod.setSlot)) {
                expect(equipmentPoints).toHaveProperty(item);
              }
            }
            if (mod.addExtras) {
              for (const item of mod.addExtras) {
                expect(equipmentPoints).toHaveProperty(item);
              }
            }
          }
        }
      }
    }
  });
});
