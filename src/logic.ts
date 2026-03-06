import type { Unit, UnitOptionDef, EquipmentDef, Model, ModelStats, UnitType } from './types';
import { equipmentPoints, type EquipmentName, equipmentDefinitions } from './data/equipment';
import { lifeformStats, type Lifeform } from './data/lifeforms';
import { unitDefinitions, unitOptions } from './data/units';

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

export const calculateEquipmentPoints = (target: {
  slots: Record<string, EquipmentName>;
  extras: EquipmentName[];
}): number => {
  const slotsCost = Object.values(target.slots).reduce(
    (sum, weapon) => sum + (equipmentPoints[weapon] || 0),
    0
  );
  const extrasCost = target.extras.reduce((sum, item) => sum + (equipmentPoints[item] || 0), 0);
  return slotsCost + extrasCost;
};

export const getModelStats = (model: Model): ModelStats | undefined => {
  return (
    model.baseStats ??
    (model.lifeform && model.class
      ? lifeformStats[model.lifeform as Lifeform]?.[model.class]
      : undefined)
  );
};

export const calculateModelPoints = (model: Model): number => {
  const baseCost = getModelStats(model)?.points ?? 0;
  return baseCost + calculateEquipmentPoints(model);
};

export const calculateUnitPoints = (unit: Unit): number => {
  const modelsPoints = unit.models.reduce((sum, m) => sum + calculateModelPoints(m), 0);
  return modelsPoints + calculateEquipmentPoints(unit);
};

export const applyModifications = (
  unit: Unit,
  modifications: Array<{
    targetName?: string;
    targetClass?: string;
    clearSlot?: string;
    setSlot?: Record<string, EquipmentName>;
    clearUnitSlot?: string;
    setUnitSlot?: Record<string, EquipmentName>;
    addExtras?: EquipmentName[];
    addUnitExtras?: EquipmentName[];
  }>
) => {
  for (const mod of modifications) {
    if (mod.clearUnitSlot) delete unit.slots[mod.clearUnitSlot];
    if (mod.setUnitSlot) {
      for (const [k, v] of Object.entries(mod.setUnitSlot)) {
        unit.slots[k] = v;
      }
    }
    if (mod.addUnitExtras) {
      for (const extra of mod.addUnitExtras) {
        if (!unit.extras.includes(extra)) {
          unit.extras.push(extra);
        }
      }
    }

    for (const model of unit.models) {
      if (mod.targetName && model.name !== mod.targetName) continue;
      if (mod.targetClass && model.class !== mod.targetClass) continue;
      if (mod.clearSlot) delete model.slots[mod.clearSlot];
      if (mod.setSlot) {
        for (const [k, v] of Object.entries(mod.setSlot)) {
          model.slots[k] = v;
        }
      }
      if (mod.addExtras) {
        for (const extra of mod.addExtras) {
          if (!model.extras.includes(extra)) {
            model.extras.push(extra);
          }
        }
      }
    }
  }
};

export const resetUnitToBase = (unit: Unit) => {
  const def = unitDefinitions[unit.type];
  unit.models = [];
  unit.slots = { ...def.slots } as Record<string, EquipmentName>;
  unit.extras = [...(def.extras || [])];

  for (const modelDef of def.models) {
    unit.models.push({
      id: crypto.randomUUID(),
      name: modelDef.name,
      lifeform: modelDef.baseStats ? undefined : unit.lifeform,
      class: modelDef.class,
      baseStats: modelDef.baseStats,
      slots: { ...modelDef.slots } as Record<string, EquipmentName>,
      extras: [...modelDef.extras],
    });
  }
};

export const applyUnitOptions = (unit: Unit) => {
  const availableOptions = unitOptions[unit.type] || [];
  const activeSelectedOptions = unit.selectedOptions || [];

  for (const optionDef of availableOptions) {
    if (optionDef.type === 'slot') {
      const choiceIds = optionDef.choices?.map((c) => c.id) || [];
      const activeChoiceId = activeSelectedOptions.find((id) => choiceIds.includes(id));
      if (activeChoiceId && optionDef.slotName) {
        const choice = optionDef.choices!.find((c) => c.id === activeChoiceId)!;

        if (optionDef.slotName in unit.slots) {
          unit.slots[optionDef.slotName] = choice.name as EquipmentName;
        }

        for (const model of unit.models) {
          if (optionDef.slotName in model.slots) {
            model.slots[optionDef.slotName] = choice.name as EquipmentName;
          }
        }

        if (choice.modifications) {
          applyModifications(unit, choice.modifications);
        }
      }
    } else {
      if (activeSelectedOptions.includes(optionDef.id) && optionDef.modifications) {
        applyModifications(unit, optionDef.modifications);
      }
      if (optionDef.choices) {
        for (const choice of optionDef.choices) {
          if (activeSelectedOptions.includes(choice.id)) {
            applyModifications(unit, choice.modifications || []);
          }
        }
      }
    }
  }
};

export const populateModels = (unit: Unit, freeEdit: boolean) => {
  if (freeEdit) return;
  resetUnitToBase(unit);
  applyUnitOptions(unit);
};

export const unitTypeHasLifeform = (type: UnitType): boolean => {
  return unitDefinitions[type].models.some((m) => !m.baseStats);
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

export const toggleUnitOptionLogic = (unit: Unit, optionId: string, freeEdit: boolean) => {
  const index = unit.selectedOptions.indexOf(optionId);
  if (index === -1) {
    unit.selectedOptions.push(optionId);
  } else {
    unit.selectedOptions.splice(index, 1);
  }
  populateModels(unit, freeEdit);
};

export const selectUnitOptionChoiceLogic = (
  unit: Unit,
  parentOptionId: string,
  choiceId: string | null,
  freeEdit: boolean
) => {
  const availableOptions = unitOptions[unit.type] || [];
  const parent = availableOptions.find((o) => o.id === parentOptionId);
  if (!parent || !parent.choices) return;

  // Remove all choices of this parent from selectedOptions
  const choiceIds = parent.choices.map((c) => c.id);
  unit.selectedOptions = unit.selectedOptions.filter((id) => !choiceIds.includes(id));

  // Add the new choice if provided
  if (choiceId) {
    unit.selectedOptions.push(choiceId);
  }

  populateModels(unit, freeEdit);
};
