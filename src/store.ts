import { reactive, computed } from 'vue'
import type { Army, Unit, Model, UnitType } from './types'
import { unitDefinitions, lifeformClassPoints, weaponPoints, unitOptions, type EquipmentName, type Lifeform } from './data'

export const armyState = reactive<Army>({
    name: 'New Army',
    units: [],
    freeEdit: false
})

export const setFreeEdit = (val: boolean) => {
    armyState.freeEdit = val;
}

export const calculateModelPoints = (model: Model): number => {
    const baseCost = model.basePoints !== undefined 
        ? model.basePoints 
        : (lifeformClassPoints[model.lifeform]?.[model.class] || 0);
    const slotsCost = Object.values(model.slots).reduce((sum, weapon) => sum + (weaponPoints[weapon] || 0), 0);
    const extrasCost = model.extras.reduce((sum, item) => sum + (weaponPoints[item] || 0), 0);
    return baseCost + slotsCost + extrasCost;
}

export const calculateUnitPoints = (unit: Unit): number => {
    const modelsPoints = unit.models.reduce((sum, m) => sum + calculateModelPoints(m), 0);
    const slotsPoints = Object.values(unit.slots).reduce((sum, weapon) => sum + (weaponPoints[weapon] || 0), 0);
    const extrasPoints = unit.extras.reduce((sum, item) => sum + (weaponPoints[item] || 0), 0);
    return modelsPoints + slotsPoints + extrasPoints;
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
    setBasePoints?: number;
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
            if (mod.setBasePoints !== undefined) {
                model.basePoints = mod.setBasePoints;
            }
        }
    }
}

const populateModels = (unit: Unit) => {
    if (armyState.freeEdit) return;
    const def = unitDefinitions[unit.type]
    unit.models = []
    unit.slots = { ...def.slots } as Record<string, EquipmentName>
    unit.extras = [ ...(def.extras || []) ]

    for (const modelDef of def.models) {
        unit.models.push({
            id: crypto.randomUUID(),
            name: modelDef.name,
            lifeform: modelDef.class === 'Vehicle' ? 'None' : unit.lifeform,
            class: modelDef.class,
            basePoints: modelDef.basePoints,
            slots: { ...modelDef.slots } as Record<string, EquipmentName>,
            extras: [...modelDef.extras]
        });
    }

    const availableOptions = unitOptions[unit.type] || [];
    const activeSelectedOptions = unit.selectedOptions || [];

    for (const optionDef of availableOptions) {
        if (optionDef.type === 'slot') {
            // Find which choice (if any) is active for this slot
            const choiceIds = optionDef.choices?.map(c => c.id) || [];
            const activeChoiceId = activeSelectedOptions.find(id => choiceIds.includes(id));
            if (activeChoiceId && optionDef.slotName) {
                const choice = optionDef.choices!.find(c => c.id === activeChoiceId)!;
                
                // Check if it's a unit slot
                if (optionDef.slotName in unit.slots) {
                    unit.slots[optionDef.slotName] = choice.name as EquipmentName;
                }

                // Apply to every model that has this slot
                for (const model of unit.models) {
                    if (optionDef.slotName in model.slots) {
                        model.slots[optionDef.slotName] = choice.name as EquipmentName;
                    }
                }

                // Also apply any additional modifications attached to this choice
                if (choice.modifications) {
                    applyModifications(unit, choice.modifications);
                }
            }
        } else {
            // Toggle option: apply parent modifications if active
            if (activeSelectedOptions.includes(optionDef.id) && optionDef.modifications) {
                applyModifications(unit, optionDef.modifications);
            }
            // Dropdown option (has choices, each with modifications): apply the active choice
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

export const addUnit = () => {
    const newUnit: Unit = {
        id: crypto.randomUUID(),
        name: 'New Unit',
        type: 'Infantry',
        lifeform: 'Human',
        selectedOptions: [],
        models: [],
        slots: {},
        extras: []
    }
    populateModels(newUnit)
    armyState.units.push(newUnit)
}

export const removeUnit = (unitId: string) => {
    const index = armyState.units.findIndex(u => u.id === unitId)
    if (index !== -1) {
        armyState.units.splice(index, 1)
    }
}

export const changeUnitType = (unitId: string, newType: UnitType) => {
    const unit = armyState.units.find(u => u.id === unitId)
    if (unit) {
        unit.type = newType;
        unit.selectedOptions = [];
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

export const updateUnitName = (unitId: string, name: string) => {
    const unit = armyState.units.find(u => u.id === unitId);
    if (unit) unit.name = name;
}

export const addSlotToUnit = (unitId: string, slotName: string, weapon: EquipmentName) => {
    const unit = armyState.units.find(u => u.id === unitId);
    if (unit) unit.slots[slotName] = weapon;
}

export const removeSlotFromUnit = (unitId: string, slotName: string) => {
    const unit = armyState.units.find(u => u.id === unitId);
    if (unit) delete unit.slots[slotName];
}

export const addExtraToUnit = (unitId: string, item: EquipmentName) => {
    const unit = armyState.units.find(u => u.id === unitId);
    if (unit) unit.extras.push(item);
}

export const removeExtraFromUnit = (unitId: string, index: number) => {
    const unit = armyState.units.find(u => u.id === unitId);
    if (unit) unit.extras.splice(index, 1);
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

export const updateModelBasePoints = (unitId: string, modelId: string, pts: number | undefined) => {
    const unit = armyState.units.find(u => u.id === unitId);
    const model = unit?.models.find(m => m.id === modelId);
    if (model) model.basePoints = pts;
}

export const addSlotToModel = (unitId: string, modelId: string, slotName: string, weapon: EquipmentName) => {
    const unit = armyState.units.find(u => u.id === unitId);
    const model = unit?.models.find(m => m.id === modelId);
    if (model) model.slots[slotName] = weapon;
}

export const removeSlotFromModel = (unitId: string, modelId: string, slotName: string) => {
    const unit = armyState.units.find(u => u.id === unitId);
    const model = unit?.models.find(m => m.id === modelId);
    if (model) delete model.slots[slotName];
}

export const addExtraToModel = (unitId: string, modelId: string, item: EquipmentName) => {
    const unit = armyState.units.find(u => u.id === unitId);
    const model = unit?.models.find(m => m.id === modelId);
    if (model) model.extras.push(item);
}

export const removeExtraFromModel = (unitId: string, modelId: string, index: number) => {
    const unit = armyState.units.find(u => u.id === unitId);
    const model = unit?.models.find(m => m.id === modelId);
    if (model) model.extras.splice(index, 1);
}
