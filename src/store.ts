import { reactive, computed } from 'vue'
import type { Army, Unit, Model, UnitType, Lifeform } from './types'
import { unitDefinitions, lifeformClassPoints, weaponPoints, unitOptions } from './data'

export const armyState = reactive<Army>({
    name: 'New Army',
    units: []
})

export const calculateModelPoints = (model: Model): number => {
    const baseCost = lifeformClassPoints[model.lifeform][model.class] || 0;
    const slotsCost = Object.values(model.slots).reduce((sum, weapon) => sum + (weaponPoints[weapon] || 0), 0);
    const extrasCost = model.extras.reduce((sum, item) => sum + (weaponPoints[item] || 0), 0);
    return baseCost + slotsCost + extrasCost;
}

export const totalArmyPoints = computed(() => {
    return armyState.units.reduce((acc, unit) => {
        return acc + unit.models.reduce((unitAcc, model) => unitAcc + calculateModelPoints(model), 0)
    }, 0)
})

const populateModels = (unit: Unit) => {
    const def = unitDefinitions[unit.type]
    unit.models = []

    for (const modelDef of def.models) {
        unit.models.push({
            id: crypto.randomUUID(),
            name: modelDef.name,
            lifeform: unit.lifeform,
            class: modelDef.class,
            slots: { ...modelDef.slots },
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
                // Apply to every model that has this slot
                for (const model of unit.models) {
                    if (optionDef.slotName in model.slots) {
                        model.slots[optionDef.slotName] = choice.name;
                    }
                }
            }
        } else {
            // Toggle option: apply parent modifications if active
            if (activeSelectedOptions.includes(optionDef.id) && optionDef.modifications) {
                for (const mod of optionDef.modifications) {
                    for (const model of unit.models) {
                        if (mod.targetName && model.name !== mod.targetName) continue;
                        if (mod.targetClass && model.class !== mod.targetClass) continue;

                        if (mod.clearSlot) {
                            delete model.slots[mod.clearSlot];
                        }
                        if (mod.setSlot) {
                            for (const [slotName, weapon] of Object.entries(mod.setSlot)) {
                                model.slots[slotName] = weapon;
                            }
                        }
                        if (mod.addExtras) {
                            model.extras.push(...mod.addExtras);
                        }
                    }
                }
            }
            // Dropdown option (has choices, each with modifications): apply the active choice
            if (optionDef.choices) {
                const applyMods = (mods: typeof optionDef.modifications) => {
                    if (!mods) return;
                    for (const mod of mods) {
                        for (const model of unit.models) {
                            if (mod.targetName && model.name !== mod.targetName) continue;
                            if (mod.targetClass && model.class !== mod.targetClass) continue;
                            if (mod.clearSlot) delete model.slots[mod.clearSlot];
                            if (mod.setSlot) {
                                for (const [k, v] of Object.entries(mod.setSlot)) {
                                    model.slots[k] = v;
                                }
                            }
                            if (mod.addExtras) model.extras.push(...mod.addExtras);
                        }
                    }
                };
                for (const choice of optionDef.choices) {
                    if (activeSelectedOptions.includes(choice.id)) {
                        applyMods(choice.modifications);
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
        models: []
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
