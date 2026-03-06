import type { Unit, UnitOptionDef, EquipmentDef } from './types';
import { equipmentPoints, type EquipmentName, equipmentDefinitions } from './data/equipment';

export const getDef = (name: string): EquipmentDef | undefined => {
  return (equipmentDefinitions as any)[name];
};

export const formatStats = (name: string) => {
  const def = getDef(name);
  if (!def) return '';
  if (!def.weapon && (!def.traits || def.traits.length === 0)) return '';

  let stats = '';
  if (def.weapon) {
    const w = def.weapon;
    const parts = [];
    if (w.range) parts.push(`${w.range}"`);
    parts.push(`S${w.shots ?? '-'}`);
    parts.push(`D${w.damage ?? '-'}${w.bonusDamage ? `(x${w.bonusDamage})` : ''}`);
    stats += parts.join(' ');
  }

  if (def.traits && def.traits.length > 0) {
    if (stats) stats += ' ';
    stats += def.traits.join(' • ');
  }

  return stats ? ` - ${stats}` : '';
};

export const getOptionDefaultLabel = (opt: UnitOptionDef, unit: Unit) => {
  // Check unit slots first
  if (opt.type === 'slot' && opt.slotName && unit.slots[opt.slotName]) {
    const currentWeapon = unit.slots[opt.slotName];
    const points = equipmentPoints[currentWeapon as EquipmentName];
    const pointsLabel = points !== undefined ? ` [${points}]` : '';
    const statsLabel = formatStats(currentWeapon);
    return `Default (${currentWeapon}${pointsLabel}${statsLabel})`;
  }

  // If the first choice's first modification targets a slot, find the current value of that slot
  const firstMod = opt.choices?.[0]?.modifications?.[0];
  if (
    firstMod &&
    (firstMod.setSlot || firstMod.clearSlot || firstMod.setUnitSlot || firstMod.clearUnitSlot)
  ) {
    if (firstMod.setUnitSlot || firstMod.clearUnitSlot) {
      const slotName = firstMod.setUnitSlot
        ? Object.keys(firstMod.setUnitSlot)[0]
        : firstMod.clearUnitSlot!;
      const currentWeapon = unit.slots[slotName];
      if (currentWeapon) {
        const points = equipmentPoints[currentWeapon as EquipmentName];
        const pointsLabel = points !== undefined ? ` [${points}]` : '';
        const statsLabel = formatStats(currentWeapon);
        return `Default (${currentWeapon}${pointsLabel}${statsLabel})`;
      }
    }

    const slotName = firstMod.setSlot ? Object.keys(firstMod.setSlot)[0] : firstMod.clearSlot!;

    // Find a model this option targets
    const targetModel = unit.models.find((m) => {
      const nameMatch = !firstMod.targetName || m.name === firstMod.targetName;
      const classMatch = !firstMod.targetClass || m.class === firstMod.targetClass;
      return nameMatch && classMatch && m.slots[slotName];
    });

    if (targetModel) {
      const currentWeapon = targetModel.slots[slotName];
      const points = equipmentPoints[currentWeapon as EquipmentName];
      const pointsLabel = points !== undefined ? ` [${points}]` : '';
      const statsLabel = formatStats(currentWeapon);
      return `Default (${currentWeapon}${pointsLabel}${statsLabel})`;
    }
  }

  // If the option itself is a slot type
  if (opt.type === 'slot' && opt.slotName) {
    const targetModel = unit.models.find((m) => m.slots[opt.slotName!]);
    if (targetModel) {
      const currentWeapon = targetModel.slots[opt.slotName!];
      const points = equipmentPoints[currentWeapon as EquipmentName];
      const pointsLabel = points !== undefined ? ` [${points}]` : '';
      const statsLabel = formatStats(currentWeapon);
      return `Default (${currentWeapon}${pointsLabel}${statsLabel})`;
    }
  }

  return '(Default / None)';
};

const findWeaponInChoice = (choice: any): string | undefined => {
  // Try weapon name directly first
  if (equipmentPoints[choice.name as EquipmentName] !== undefined) {
    return choice.name;
  }

  // If not found, check modifications
  if (choice.modifications) {
    for (const mod of choice.modifications) {
      if (mod.setSlot) {
        return Object.values(mod.setSlot)[0] as string;
      }
      if (mod.setUnitSlot) {
        return Object.values(mod.setUnitSlot)[0] as string;
      }
    }
  }
  return undefined;
};

export const getChoicePointsLabel = (choice: any) => {
  const weaponName = findWeaponInChoice(choice);
  if (weaponName) {
    const points = equipmentPoints[weaponName as EquipmentName];
    return points !== undefined ? ` [${points}]` : '';
  }
  return '';
};

export const getChoiceStatsLabel = (choice: any) => {
  const weaponName = findWeaponInChoice(choice);
  if (weaponName) {
    return formatStats(weaponName);
  }
  return '';
};

export const getOptionPointsLabel = (opt: UnitOptionDef) => {
  if (!opt.choices && opt.modifications) {
    let total = 0;
    let found = false;
    for (const mod of opt.modifications) {
      if (mod.addExtras) {
        total += mod.addExtras.reduce(
          (sum, item) => sum + (equipmentPoints[item as EquipmentName] || 0),
          0
        );
        found = true;
      }
      if (mod.setSlot) {
        const weaponName = Object.values(mod.setSlot)[0] as string;
        const wp = equipmentPoints[weaponName as EquipmentName];
        if (wp !== undefined) {
          total += wp;
          found = true;
        }
      }
    }
    if (found) return ` [${total}]`;
  }
  return '';
};

export const getOptionStatsLabel = (opt: UnitOptionDef) => {
  if (!opt.choices && opt.modifications) {
    const statsStrings: string[] = [];
    for (const mod of opt.modifications) {
      if (mod.addExtras) {
        for (const item of mod.addExtras) {
          const stats = formatStats(item);
          if (stats) statsStrings.push(stats.replace(/^ - /, ''));
        }
      }
      if (mod.setSlot) {
        const weaponName = Object.values(mod.setSlot)[0] as string;
        const stats = formatStats(weaponName);
        if (stats) statsStrings.push(stats.replace(/^ - /, ''));
      }
    }
    if (statsStrings.length > 0) {
      return ` - ${statsStrings.join(', ')}`;
    }
  }
  return '';
};
