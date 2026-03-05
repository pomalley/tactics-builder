import { reactive, computed, watch } from 'vue'
import type { Army, Unit, Model, ModelStats, UnitType, AppState } from './types'
import { Lifeform, lifeformStats } from './data/lifeforms';
import { EquipmentName, equipmentPoints } from './data/equipment';
import { unitDefinitions, unitOptions } from './data/units';

const STORAGE_KEY = 'tactics-army-builder-state'

const getDefaultArmy = (): Army => ({
    id: crypto.randomUUID(),
    name: 'New Army',
    units: [],
    freeEdit: false,
    defaultLifeform: 'Human'
})

const getDefaultState = (): AppState => {
    const defaultArmy = getDefaultArmy();
    return {
        armies: [defaultArmy],
        currentArmyId: defaultArmy.id,
        selectedUnitId: null
    }
}

const loadState = (): AppState => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
        try {
            const data = JSON.parse(saved)
            // Migration: if it's the old Army structure
            if (data.units && !data.armies) {
                const legacyArmy: Army = {
                    id: crypto.randomUUID(),
                    name: data.name || 'New Army',
                    units: data.units,
                    freeEdit: !!data.freeEdit,
                    defaultLifeform: 'Human'
                }
                return {
                    armies: [legacyArmy],
                    currentArmyId: legacyArmy.id,
                    selectedUnitId: null
                }
            }
            if (data.selectedUnitId === undefined) {
                data.selectedUnitId = null;
            }
            // Migration: Add defaultLifeform to existing armies
            data.armies.forEach((a: Army) => {
                if (!a.defaultLifeform) a.defaultLifeform = 'Human';
            });
            return data as AppState
        } catch (e) {
            console.error('Failed to load state from localStorage', e)
        }
    }
    return getDefaultState()
}

// Using shallowReactive for the top-level state to avoid nested proxy overhead
// but keeping the internal arrays reactive as needed via resetStore.
export const appState = reactive<AppState>(loadState())

export const resetStore = (initialState?: AppState) => {
    const next = initialState || getDefaultState();
    appState.armies = next.armies;
    appState.currentArmyId = next.currentArmyId;
    appState.selectedUnitId = next.selectedUnitId;
}

// Internal computed for finding current army
const currentArmy = computed(() => {
    const current = appState.armies.find(a => a.id === appState.currentArmyId);
    if (current) return current;
    if (appState.armies.length > 0) return appState.armies[0];
    const fresh = getDefaultArmy();
    appState.armies.push(fresh);
    appState.currentArmyId = fresh.id;
    return fresh;
})

// armyState is a reactive proxy that always delegates to currentArmy.value
export const armyState = reactive(new Proxy({} as Army, {
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
    }
}))

watch(appState, (newState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
}, { deep: true })

export const addArmy = () => {
    const newArmy = getDefaultArmy();
    appState.armies.push(newArmy);
    appState.currentArmyId = newArmy.id;
}

export const selectArmy = (id: string) => {
    appState.currentArmyId = id;
    appState.selectedUnitId = null;
}

export const removeArmy = (id: string) => {
    if (appState.armies.length <= 1) return;
    const index = appState.armies.findIndex(a => a.id === id);
    if (index !== -1) {
        appState.armies.splice(index, 1);
        if (appState.currentArmyId === id) {
            appState.currentArmyId = appState.armies[0].id;
            appState.selectedUnitId = null;
        }
    }
}

export const updateArmyName = (id: string, name: string) => {
    const army = appState.armies.find(a => a.id === id);
    if (army) army.name = name;
}

export const updateArmyDefaultLifeform = (id: string, lifeform: Lifeform) => {
    const army = appState.armies.find(a => a.id === id);
    if (army) army.defaultLifeform = lifeform;
}

export const setFreeEdit = (val: boolean) => {
    armyState.freeEdit = val;
}

const calculateEquipmentPoints = (target: { slots: Record<string, EquipmentName>, extras: EquipmentName[] }): number => {
    const slotsCost = Object.values(target.slots).reduce((sum, weapon) => sum + (equipmentPoints[weapon] || 0), 0);
    const extrasCost = target.extras.reduce((sum, item) => sum + (equipmentPoints[item] || 0), 0);
    return slotsCost + extrasCost;
}

export const getModelStats = (model: Model): ModelStats | undefined => {
    return model.baseStats ?? (model.lifeform && model.class ? lifeformStats[model.lifeform as Lifeform]?.[model.class] : undefined);
}

export const calculateModelPoints = (model: Model): number => {
    const baseCost = getModelStats(model)?.points ?? 0;
    return baseCost + calculateEquipmentPoints(model);
}

export const calculateUnitPoints = (unit: Unit): number => {
    const modelsPoints = unit.models.reduce((sum, m) => sum + calculateModelPoints(m), 0);
    return modelsPoints + calculateEquipmentPoints(unit);
}

export const totalArmyPoints = computed(() => {
    return armyState.units.reduce((acc, unit) => {
        return acc + calculateUnitPoints(unit)
    }, 0)
})

const applyModifications = (unit: Unit, modifications: Array<{
    targetName?: string;
    targetClass?: string;
    clearSlot?: string;
    setSlot?: Record<string, EquipmentName>;
    clearUnitSlot?: string;
    setUnitSlot?: Record<string, EquipmentName>;
    addExtras?: EquipmentName[];
    addUnitExtras?: EquipmentName[];
}>) => {
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
}

const resetUnitToBase = (unit: Unit) => {
    const def = unitDefinitions[unit.type]
    unit.models = []
    unit.slots = { ...def.slots } as Record<string, EquipmentName>
    unit.extras = [ ...(def.extras || []) ]

    for (const modelDef of def.models) {
        unit.models.push({
            id: crypto.randomUUID(),
            name: modelDef.name,
            lifeform: modelDef.baseStats ? undefined : unit.lifeform,
            class: modelDef.class,
            baseStats: modelDef.baseStats,
            slots: { ...modelDef.slots } as Record<string, EquipmentName>,
            extras: [...modelDef.extras]
        });
    }
}

const applyUnitOptions = (unit: Unit) => {
    const availableOptions = unitOptions[unit.type] || [];
    const activeSelectedOptions = unit.selectedOptions || [];

    for (const optionDef of availableOptions) {
        if (optionDef.type === 'slot') {
            const choiceIds = optionDef.choices?.map(c => c.id) || [];
            const activeChoiceId = activeSelectedOptions.find(id => choiceIds.includes(id));
            if (activeChoiceId && optionDef.slotName) {
                const choice = optionDef.choices!.find(c => c.id === activeChoiceId)!;
                
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
}

export const populateModels = (unit: Unit) => {
    if (armyState.freeEdit) return;
    resetUnitToBase(unit);
    applyUnitOptions(unit);
}

const unitTypeHasLifeform = (type: UnitType): boolean => {
    return unitDefinitions[type].models.some(m => !m.baseStats);
}

export const addUnitWithType = (type: UnitType) => {
    const newUnit: Unit = {
        id: crypto.randomUUID(),
        name: 'New ' + type,
        type,
        lifeform: unitTypeHasLifeform(type) ? armyState.defaultLifeform : undefined,
        selectedOptions: [],
        models: [],
        slots: {},
        extras: []
    }
    populateModels(newUnit)
    armyState.units.push(newUnit)
    selectUnit(newUnit.id)
}

export const selectUnit = (unitId: string | null) => {
    appState.selectedUnitId = unitId;
}

export const removeUnit = (unitId: string) => {
    const index = armyState.units.findIndex(u => u.id === unitId)
    if (index !== -1) {
        armyState.units.splice(index, 1)
        if (appState.selectedUnitId === unitId) {
            appState.selectedUnitId = null;
        }
    }
}

export const moveUnit = (unitId: string, direction: 'up' | 'down') => {
    const index = armyState.units.findIndex(u => u.id === unitId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= armyState.units.length) return;

    const [unit] = armyState.units.splice(index, 1);
    armyState.units.splice(newIndex, 0, unit);
}

export const updateUnitsOrder = (newUnits: Unit[]) => {
    armyState.units = [...newUnits];
}

export const changeUnitType = (unitId: string, newType: UnitType) => {
    const unit = armyState.units.find(u => u.id === unitId)
    if (unit) {
        unit.type = newType;
        unit.selectedOptions = [];
        unit.lifeform = unitTypeHasLifeform(newType) ? (unit.lifeform || armyState.defaultLifeform) : undefined;
        populateModels(unit);
    }
}

export const changeUnitLifeform = (unitId: string, newLifeform: Lifeform) => {
    const unit = armyState.units.find(u => u.id === unitId)
    if (unit) {
        unit.lifeform = newLifeform;
        unit.models.forEach(m => m.lifeform = newLifeform);
    }
}

export const addModelToUnit = (unitId: string) => {
    const unit = armyState.units.find(u => u.id === unitId)
    if (unit) {
        const newModel: Model = {
            id: crypto.randomUUID(),
            name: 'New Model',
            lifeform: unit.lifeform,
            class: 'Soldier',
            slots: {},
            extras: []
        }
        unit.models.push(newModel)
    }
}

export const removeModelFromUnit = (unitId: string, modelId: string) => {
    const unit = armyState.units.find(u => u.id === unitId)
    if (unit) {
        const index = unit.models.findIndex(m => m.id === modelId)
        if (index !== -1) {
            unit.models.splice(index, 1)
        }
    }
}

export const toggleUnitOption = (unitId: string, optionId: string) => {
    const unit = armyState.units.find(u => u.id === unitId);
    if (unit) {
        const index = unit.selectedOptions.indexOf(optionId);
        if (index === -1) {
            unit.selectedOptions.push(optionId);
        } else {
            unit.selectedOptions.splice(index, 1);
        }
        populateModels(unit);
    }
}

export const selectUnitOptionChoice = (unitId: string, parentOptionId: string, choiceId: string | null) => {
    const unit = armyState.units.find(u => u.id === unitId);
    if (!unit) return;

    const availableOptions = unitOptions[unit.type] || [];
    const parent = availableOptions.find(o => o.id === parentOptionId);
    if (!parent || !parent.choices) return;

    // Remove all choices of this parent from selectedOptions
    const choiceIds = parent.choices.map(c => c.id);
    unit.selectedOptions = unit.selectedOptions.filter(id => !choiceIds.includes(id));

    // Add the new choice if provided
    if (choiceId) {
        unit.selectedOptions.push(choiceId);
    }

    populateModels(unit);
}

const findTarget = (unitId: string, modelId?: string): { slots: Record<string, EquipmentName>, extras: EquipmentName[] } | undefined => {
    const unit = armyState.units.find(u => u.id === unitId);
    if (!unit) return undefined;
    if (modelId) return unit.models.find(m => m.id === modelId);
    return unit;
}

export const updateUnitName = (unitId: string, name: string) => {
    const unit = armyState.units.find(u => u.id === unitId);
    if (unit) unit.name = name;
}

export const addSlotToUnit = (unitId: string, slotName: string, weapon: EquipmentName) => {
    const target = findTarget(unitId);
    if (target) target.slots[slotName] = weapon;
}

export const removeSlotFromUnit = (unitId: string, slotName: string) => {
    const target = findTarget(unitId);
    if (target) delete target.slots[slotName];
}

export const addExtraToUnit = (unitId: string, item: EquipmentName) => {
    const target = findTarget(unitId);
    if (target) target.extras.push(item);
}

export const removeExtraFromUnit = (unitId: string, index: number) => {
    const target = findTarget(unitId);
    if (target) target.extras.splice(index, 1);
}

export const updateModelName = (unitId: string, modelId: string, name: string) => {
    const unit = armyState.units.find(u => u.id === unitId);
    const model = unit?.models.find(m => m.id === modelId);
    if (model) model.name = name;
}

export const updateModelClass = (unitId: string, modelId: string, cls: any) => {
    const unit = armyState.units.find(u => u.id === unitId);
    const model = unit?.models.find(m => m.id === modelId);
    if (model) model.class = cls;
}

export const addSlotToModel = (unitId: string, modelId: string, slotName: string, weapon: EquipmentName) => {
    const target = findTarget(unitId, modelId);
    if (target) target.slots[slotName] = weapon;
}

export const removeSlotFromModel = (unitId: string, modelId: string, slotName: string) => {
    const target = findTarget(unitId, modelId);
    if (target) delete target.slots[slotName];
}

export const addExtraToModel = (unitId: string, modelId: string, item: EquipmentName) => {
    const target = findTarget(unitId, modelId);
    if (target) target.extras.push(item);
}

export const removeExtraFromModel = (unitId: string, modelId: string, index: number) => {
    const target = findTarget(unitId, modelId);
    if (target) target.extras.splice(index, 1);
}
