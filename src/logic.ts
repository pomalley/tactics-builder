import type { Unit, UnitOptionDef } from "./types";
import { equipmentPoints, type EquipmentName } from "./data/equipment";

export const getOptionDefaultLabel = (opt: UnitOptionDef, unit: Unit) => {
  // Check unit slots first
  if (opt.type === "slot" && opt.slotName && unit.slots[opt.slotName]) {
    const currentWeapon = unit.slots[opt.slotName];
    const points = equipmentPoints[currentWeapon as EquipmentName];
    const pointsLabel = points !== undefined ? ` [${points}]` : "";
    return `Default (${currentWeapon}${pointsLabel})`;
  }

  // If the first choice's first modification targets a slot, find the current value of that slot
  const firstMod = opt.choices?.[0]?.modifications?.[0];
  if (firstMod && (firstMod.setSlot || firstMod.clearSlot || firstMod.setUnitSlot || firstMod.clearUnitSlot)) {
    if (firstMod.setUnitSlot || firstMod.clearUnitSlot) {
        const slotName = firstMod.setUnitSlot ? Object.keys(firstMod.setUnitSlot)[0] : firstMod.clearUnitSlot!;
        const currentWeapon = unit.slots[slotName];
        if (currentWeapon) {
            const points = equipmentPoints[currentWeapon as EquipmentName];
            const pointsLabel = points !== undefined ? ` [${points}]` : "";
            return `Default (${currentWeapon}${pointsLabel})`;
        }
    }

    const slotName = firstMod.setSlot
      ? Object.keys(firstMod.setSlot)[0]
      : firstMod.clearSlot!;

    // Find a model this option targets
    const targetModel = unit.models.find((m) => {
      const nameMatch = !firstMod.targetName || m.name === firstMod.targetName;
      const classMatch =
        !firstMod.targetClass || m.class === firstMod.targetClass;
      return nameMatch && classMatch && m.slots[slotName];
    });

    if (targetModel) {
      const currentWeapon = targetModel.slots[slotName];
      const points = equipmentPoints[currentWeapon as EquipmentName];
      const pointsLabel = points !== undefined ? ` [${points}]` : "";
      return `Default (${currentWeapon}${pointsLabel})`;
    }
  }

  // If the option itself is a slot type
  if (opt.type === "slot" && opt.slotName) {
    const targetModel = unit.models.find((m) => m.slots[opt.slotName!]);
    if (targetModel) {
      const currentWeapon = targetModel.slots[opt.slotName!];
      const points = equipmentPoints[currentWeapon as EquipmentName];
      const pointsLabel = points !== undefined ? ` [${points}]` : "";
      return `Default (${currentWeapon}${pointsLabel})`;
    }
  }

  return "(Default / None)";
};

export const getChoicePointsLabel = (choice: any) => {
  // Try weapon name directly first
  let points = equipmentPoints[choice.name as EquipmentName];

  // If not found, check modifications
  if (points === undefined && choice.modifications) {
    for (const mod of choice.modifications) {
      if (mod.setSlot) {
        const weaponName = Object.values(mod.setSlot)[0] as string;
        points = equipmentPoints[weaponName as EquipmentName];
        if (points !== undefined) break;
      }
      if (mod.setUnitSlot) {
        const weaponName = Object.values(mod.setUnitSlot)[0] as string;
        points = equipmentPoints[weaponName as EquipmentName];
        if (points !== undefined) break;
      }
    }
  }

  return points !== undefined ? ` [${points}]` : "";
};

export const getOptionPointsLabel = (opt: UnitOptionDef) => {
  if (!opt.choices && opt.modifications) {
    let total = 0;
    let found = false;
    for (const mod of opt.modifications) {
      if (mod.addExtras) {
        total += mod.addExtras.reduce(
          (sum, item) => sum + (equipmentPoints[item as EquipmentName] || 0),
          0,
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
  return "";
};
