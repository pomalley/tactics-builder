import { reactive, computed, watch } from 'vue';
import type { Army, Unit, Model, UnitType, AppState } from './types';
import { type Lifeform } from './data/lifeforms';
import { type EquipmentName } from './data/equipment';
import {
  calculateUnitPoints,
  populateModels,
  unitTypeHasLifeform,
  toggleUnitOptionLogic,
  selectUnitOptionChoiceLogic,
} from './logic';

const STORAGE_KEY = 'tactics-army-builder-state';

const getDefaultArmy = (): Army => ({
  id: crypto.randomUUID(),
  name: 'New Army',
  units: [],
  freeEdit: false,
  defaultLifeform: 'Human',
});

const getDefaultState = (): AppState => {
  const defaultArmy = getDefaultArmy();
  return {
    armies: [defaultArmy],
    currentArmyId: defaultArmy.id,
    selectedUnitId: null,
  };
};

const loadState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      // Migration: if it's the old Army structure
      if (data.units && !data.armies) {
        const legacyArmy: Army = {
          id: crypto.randomUUID(),
          name: data.name || 'New Army',
          units: data.units,
          freeEdit: !!data.freeEdit,
          defaultLifeform: 'Human',
        };
        return {
          armies: [legacyArmy],
          currentArmyId: legacyArmy.id,
          selectedUnitId: null,
        };
      }
      if (data.selectedUnitId === undefined) {
        data.selectedUnitId = null;
      }
      // Migration: Add defaultLifeform to existing armies
      data.armies.forEach((a: Army) => {
        if (!a.defaultLifeform) a.defaultLifeform = 'Human';
      });
      return data as AppState;
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }
  return getDefaultState();
};

export const appState = reactive<AppState>(loadState());

export const resetStore = (initialState?: AppState) => {
  const next = initialState || getDefaultState();
  appState.armies = next.armies;
  appState.currentArmyId = next.currentArmyId;
  appState.selectedUnitId = next.selectedUnitId;
};

const currentArmy = computed(() => {
  const current = appState.armies.find((a) => a.id === appState.currentArmyId);
  if (current) return current;
  if (appState.armies.length > 0) return appState.armies[0];
  const fresh = getDefaultArmy();
  appState.armies.push(fresh);
  appState.currentArmyId = fresh.id;
  return fresh;
});

export const armyState = reactive(
  new Proxy({} as Army, {
    get(_, prop) {
      return (currentArmy.value as any)[prop];
    },
    set(_, prop, value) {
      (currentArmy.value as any)[prop] = value;
      return true;
    },
    ownKeys() {
      return Reflect.ownKeys(currentArmy.value);
    },
    getOwnPropertyDescriptor(_, prop) {
      return Reflect.getOwnPropertyDescriptor(currentArmy.value, prop);
    },
  })
);

watch(
  appState,
  (newState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  },
  { deep: true }
);

export const addArmy = () => {
  const newArmy = getDefaultArmy();
  appState.armies.push(newArmy);
  appState.currentArmyId = newArmy.id;
};

export const selectArmy = (id: string) => {
  appState.currentArmyId = id;
  appState.selectedUnitId = null;
};

export const removeArmy = (id: string) => {
  if (appState.armies.length <= 1) return;
  const index = appState.armies.findIndex((a) => a.id === id);
  if (index !== -1) {
    appState.armies.splice(index, 1);
    if (appState.currentArmyId === id) {
      appState.currentArmyId = appState.armies[0].id;
      appState.selectedUnitId = null;
    }
  }
};

export const updateArmyName = (id: string, name: string) => {
  const army = appState.armies.find((a) => a.id === id);
  if (army) army.name = name;
};

export const updateArmyDefaultLifeform = (id: string, lifeform: Lifeform) => {
  const army = appState.armies.find((a) => a.id === id);
  if (army) army.defaultLifeform = lifeform;
};

export const setFreeEdit = (val: boolean) => {
  armyState.freeEdit = val;
};

export const totalArmyPoints = computed(() => {
  return armyState.units.reduce((acc, unit) => {
    return acc + calculateUnitPoints(unit);
  }, 0);
});

export const minimizeAllUnits = () => {
  armyState.units.forEach((u) => (u.minimized = true));
};

export const addUnitWithType = (type: UnitType) => {
  minimizeAllUnits();
  const newUnit: Unit = {
    id: crypto.randomUUID(),
    name: 'New ' + type,
    type,
    lifeform: unitTypeHasLifeform(type) ? armyState.defaultLifeform : undefined,
    selectedOptions: [],
    models: [],
    slots: {},
    extras: [],
  };
  populateModels(newUnit, armyState.freeEdit);
  armyState.units.push(newUnit);
  selectUnit(newUnit.id);
};

export const addUnit = () => {
  addUnitWithType('Infantry');
};

export const selectUnit = (unitId: string | null) => {
  appState.selectedUnitId = unitId;
};

export const removeUnit = (unitId: string) => {
  const index = armyState.units.findIndex((u) => u.id === unitId);
  if (index !== -1) {
    armyState.units.splice(index, 1);
    if (appState.selectedUnitId === unitId) {
      appState.selectedUnitId = null;
    }
  }
};

export const moveUnit = (unitId: string, direction: 'up' | 'down') => {
  const index = armyState.units.findIndex((u) => u.id === unitId);
  if (index === -1) return;

  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= armyState.units.length) return;

  const [unit] = armyState.units.splice(index, 1);
  armyState.units.splice(newIndex, 0, unit);
};

export const updateUnitsOrder = (newUnits: Unit[]) => {
  armyState.units = [...newUnits];
};

export const changeUnitType = (unitId: string, newType: UnitType) => {
  const unit = armyState.units.find((u) => u.id === unitId);
  if (unit) {
    unit.type = newType;
    unit.selectedOptions = [];
    unit.lifeform = unitTypeHasLifeform(newType)
      ? unit.lifeform || armyState.defaultLifeform
      : undefined;
    populateModels(unit, armyState.freeEdit);
  }
};

export const changeUnitLifeform = (unitId: string, newLifeform: Lifeform) => {
  const unit = armyState.units.find((u) => u.id === unitId);
  if (unit) {
    unit.lifeform = newLifeform;
    unit.models.forEach((m) => (m.lifeform = newLifeform));
  }
};

export const addModelToUnit = (unitId: string) => {
  const unit = armyState.units.find((u) => u.id === unitId);
  if (unit) {
    const newModel: Model = {
      id: crypto.randomUUID(),
      name: 'New Model',
      lifeform: unit.lifeform,
      class: 'Soldier',
      slots: {},
      extras: [],
    };
    unit.models.push(newModel);
  }
};

export const removeModelFromUnit = (unitId: string, modelId: string) => {
  const unit = armyState.units.find((u) => u.id === unitId);
  if (unit) {
    const index = unit.models.findIndex((m) => m.id === modelId);
    if (index !== -1) {
      unit.models.splice(index, 1);
    }
  }
};

export const toggleUnitOption = (unitId: string, optionId: string) => {
  const unit = armyState.units.find((u) => u.id === unitId);
  if (unit) {
    toggleUnitOptionLogic(unit, optionId, armyState.freeEdit);
  }
};

export const selectUnitOptionChoice = (
  unitId: string,
  parentOptionId: string,
  choiceId: string | null
) => {
  const unit = armyState.units.find((u) => u.id === unitId);
  if (unit) {
    selectUnitOptionChoiceLogic(unit, parentOptionId, choiceId, armyState.freeEdit);
  }
};

const findTarget = (
  unitId: string,
  modelId?: string
): { slots: Record<string, EquipmentName>; extras: EquipmentName[] } | undefined => {
  const unit = armyState.units.find((u) => u.id === unitId);
  if (!unit) return undefined;
  if (modelId) return unit.models.find((m) => m.id === modelId);
  return unit;
};

export const updateUnitName = (unitId: string, name: string) => {
  const unit = armyState.units.find((u) => u.id === unitId);
  if (unit) unit.name = name;
};

export const addSlotToUnit = (unitId: string, slotName: string, weapon: EquipmentName) => {
  const target = findTarget(unitId);
  if (target) target.slots[slotName] = weapon;
};

export const removeSlotFromUnit = (unitId: string, slotName: string) => {
  const target = findTarget(unitId);
  if (target) delete target.slots[slotName];
};

export const addExtraToUnit = (unitId: string, item: EquipmentName) => {
  const target = findTarget(unitId);
  if (target) target.extras.push(item);
};

export const removeExtraFromUnit = (unitId: string, index: number) => {
  const target = findTarget(unitId);
  if (target) target.extras.splice(index, 1);
};

export const updateModelName = (unitId: string, modelId: string, name: string) => {
  const unit = armyState.units.find((u) => u.id === unitId);
  const model = unit?.models.find((m) => m.id === modelId);
  if (model) model.name = name;
};

export const updateModelClass = (unitId: string, modelId: string, cls: any) => {
  const unit = armyState.units.find((u) => u.id === unitId);
  const model = unit?.models.find((m) => m.id === modelId);
  if (model) model.class = cls;
};

export const addSlotToModel = (
  unitId: string,
  modelId: string,
  slotName: string,
  weapon: EquipmentName
) => {
  const target = findTarget(unitId, modelId);
  if (target) target.slots[slotName] = weapon;
};

export const removeSlotFromModel = (unitId: string, modelId: string, slotName: string) => {
  const target = findTarget(unitId, modelId);
  if (target) delete target.slots[slotName];
};

export const addExtraToModel = (unitId: string, modelId: string, item: EquipmentName) => {
  const target = findTarget(unitId, modelId);
  if (target) target.extras.push(item);
};

export const removeExtraFromModel = (unitId: string, modelId: string, index: number) => {
  const target = findTarget(unitId, modelId);
  if (target) target.extras.splice(index, 1);
};
