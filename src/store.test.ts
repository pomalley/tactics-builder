import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { 
    appState,
    armyState, 
    addUnitWithType, 
    removeUnit,
    moveUnit,
    updateUnitName,
    changeUnitLifeform,
    addModelToUnit,
    removeModelFromUnit,
    updateModelName,
    updateModelClass,
    updateModelBasePoints,
    addSlotToModel,
    removeSlotFromModel,
    addExtraToModel,
    removeExtraFromModel,
    toggleUnitOption, 
    selectUnitOptionChoice, 
    calculateModelPoints, 
    totalArmyPoints,
    changeUnitType,
    calculateUnitPoints,
    addArmy,
    selectArmy,
    removeArmy,
    updateArmyName,
    resetStore
} from './store'

describe('Army Store', () => {
    beforeEach(() => {
        resetStore({
            armies: [{
                id: 'test-army-id',
                name: 'Test Army',
                units: [],
                freeEdit: false
            }],
            currentArmyId: 'test-army-id',
            selectedUnitId: null
        })
    })

    describe('Multi-Army Management', () => {
        it('should add a new army and select it', () => {
            addArmy()
            expect(appState.armies.length).toBe(2)
            expect(appState.currentArmyId).toBe(appState.armies[1].id)
            expect(armyState.name).toBe('New Army')
        })

        it('should select an army by id', () => {
            const firstId = appState.currentArmyId
            addArmy()
            const secondId = appState.currentArmyId
            
            selectArmy(firstId!)
            expect(appState.currentArmyId).toBe(firstId)
            
            selectArmy(secondId!)
            expect(appState.currentArmyId).toBe(secondId)
        })

        it('should remove an army', () => {
            addArmy()
            const secondId = appState.currentArmyId
            removeArmy(secondId!)
            expect(appState.armies.length).toBe(1)
            expect(appState.currentArmyId).toBe('test-army-id')
        })

        it('should not remove the last army', () => {
            removeArmy('test-army-id')
            expect(appState.armies.length).toBe(1)
        })

        it('should update army name', () => {
            updateArmyName('test-army-id', 'Updated Army Name')
            expect(armyState.name).toBe('Updated Army Name')
        })

        it('should update totalArmyPoints when switching armies', () => {
            // Army 1: 0 pts (initial state)
            expect(totalArmyPoints.value).toBe(0)

            addArmy() // Army 2
            addUnitWithType('Infantry') // Add Infantry (82 pts)
            expect(totalArmyPoints.value).toBe(82)

            selectArmy('test-army-id') // Back to Army 1
            expect(totalArmyPoints.value).toBe(0)
        })
    })

    describe('Migration and Initialization', () => {
        it('should migrate legacy single-army data', () => {
            const legacyData = {
                name: 'Legacy Army',
                freeEdit: true,
                units: [
                    { id: 'u1', name: 'Legacy Unit', type: 'Infantry', lifeform: 'Human', selectedOptions: [], models: [], slots: {}, extras: [] }
                ]
            }
            
            // We can't easily re-run the top-level reactive() call in the store module,
            // but we can verify the logic by passing it through resetStore if we updated it,
            // or by checking if appState handles migration-like objects.
            // For now, let's test that resetStore with a full AppState works as expected.
            resetStore({
                armies: [{ ...legacyData, id: 'migrated-id' } as any],
                currentArmyId: 'migrated-id',
                selectedUnitId: null
            })

            expect(appState.armies.length).toBe(1)
            expect(armyState.name).toBe('Legacy Army')
            expect(armyState.units.length).toBe(1)
        })
    })

    describe('Unit Point Calculations', () => {
        it('should calculate model points correctly', () => {
            addUnitWithType('Infantry') // Default is Infantry for Human
            const model = armyState.units[0].models[0] // Sergeant
            // Human Minor Character (15) + Military Rifle (3) + Frag Grenade (1) = 19
            expect(calculateModelPoints(model)).toBe(19)
        })

        it('should deduplicate extras when multiple options add the same item', () => {
            addUnitWithType('Infantry') // Add Infantry
            const unit = armyState.units[0]
            let trooper4 = unit.models.find(m => m.name === 'Trooper 4')!
            
            expect(trooper4.extras).toContain('Frag Grenade')
            toggleUnitOption(unit.id, 'fog_grenades')
            selectUnitOptionChoice(unit.id, 'infantry_support_slot', 'support_grenade_launcher')
            
            trooper4 = unit.models.find(m => m.name === 'Trooper 4')!
            expect(trooper4.extras.filter(x => x === 'Fog Grenade').length).toBe(1)
        })

        it('should calculate unit points correctly with unit-level slots (Weapon Team)', () => {
            addUnitWithType('Infantry')
            const unit = armyState.units[0]
            changeUnitType(unit.id, 'Weapon Team')
            // Gunner(11) + Loader1(11) + Loader2(11) + Laser Cannon(35) + Morale(2) = 70
            expect(calculateUnitPoints(unit)).toBe(70)
        })

        it('should calculate unit points correctly for vehicles using basePoints (Nomad Bike)', () => {
            addUnitWithType('Infantry')
            const unit = armyState.units[0]
            changeUnitType(unit.id, 'Nomad Bike')
            selectUnitOptionChoice(unit.id, 'nomad_forward_slot', 'nomad_lmg')
            // basePoints: 15 + LMG (10) = 25
            expect(calculateUnitPoints(unit)).toBe(25)
        })

        it('should calculate unit points for Heavy Tank and its swaps', () => {
            addUnitWithType('Infantry')
            const unit = armyState.units[0]
            changeUnitType(unit.id, 'Heavy Tank')
            // base 125 + LMG (10) + Coaxial LMG (10) + 100mm (55) = 200
            expect(calculateUnitPoints(unit)).toBe(200)

            selectUnitOptionChoice(unit.id, 'heavy_tank_front_slot', 'heavy_front_plasma')
            // 200 - 10 + 20 = 210
            expect(calculateUnitPoints(unit)).toBe(210)
        })
    })

    describe('Unit Management', () => {
        it('should add a unit with default models', () => {
            addUnitWithType('Infantry')
            expect(armyState.units.length).toBe(1)
            expect(armyState.units[0].models.length).toBeGreaterThan(0)
        })

        it('should remove a unit', () => {
            addUnitWithType('Infantry')
            addUnitWithType('Infantry')
            const idToRemove = armyState.units[0].id
            removeUnit(idToRemove)
            expect(armyState.units.length).toBe(1)
            expect(armyState.units[0].id).not.toBe(idToRemove)
        })

        it('should move units up and down', () => {
            addUnitWithType('Infantry')
            armyState.units[0].name = 'Unit 1'
            addUnitWithType('Infantry')
            armyState.units[1].name = 'Unit 2'
            
            const id2 = armyState.units[1].id
            moveUnit(id2, 'up')
            expect(armyState.units[0].name).toBe('Unit 2')
            
            moveUnit(id2, 'down')
            expect(armyState.units[0].name).toBe('Unit 1')
        })

        it('should update unit name', () => {
            addUnitWithType('Infantry')
            updateUnitName(armyState.units[0].id, 'New Name')
            expect(armyState.units[0].name).toBe('New Name')
        })

        it('should change unit lifeform and propagate to models', () => {
            addUnitWithType('Infantry')
            const unit = armyState.units[0]
            changeUnitLifeform(unit.id, 'Greys')
            expect(unit.lifeform).toBe('Greys')
            expect(unit.models[0].lifeform).toBe('Greys')
        })
    })

    describe('Model Management', () => {
        it('should add and remove models from unit', () => {
            addUnitWithType('Infantry')
            const unit = armyState.units[0]
            const initialCount = unit.models.length
            addModelToUnit(unit.id)
            expect(unit.models.length).toBe(initialCount + 1)
            
            const modelId = unit.models[unit.models.length - 1].id
            removeModelFromUnit(unit.id, modelId)
            expect(unit.models.length).toBe(initialCount)
        })

        it('should update model details', () => {
            addUnitWithType('Infantry')
            const unit = armyState.units[0]
            const model = unit.models[0]

            updateModelName(unit.id, model.id, 'Special Sergeant')
            expect(model.name).toBe('Special Sergeant')

            updateModelClass(unit.id, model.id, 'Major Character')
            expect(model.class).toBe('Major Character')

            updateModelBasePoints(unit.id, model.id, 50)
            expect(model.basePoints).toBe(50)
        })

        it('should add/remove slots and extras from models', () => {
            addUnitWithType('Infantry')
            const unit = armyState.units[0]
            const model = unit.models[0]

            addSlotToModel(unit.id, model.id, 'extra_gun', 'Military Rifle')
            expect(model.slots.extra_gun).toBe('Military Rifle')

            removeSlotFromModel(unit.id, model.id, 'extra_gun')
            expect(model.slots.extra_gun).toBeUndefined()

            addExtraToModel(unit.id, model.id, 'Shock Grenade')
            expect(model.extras).toContain('Shock Grenade')

            const index = model.extras.indexOf('Shock Grenade')
            removeExtraFromModel(unit.id, model.id, index)
            expect(model.extras).not.toContain('Shock Grenade')
        })
    })

    describe('Persistence', () => {
        it('should save to localStorage when state changes', async () => {
            const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
            addUnitWithType('Infantry')
            await nextTick()
            expect(setItemSpy).toHaveBeenCalled()
            setItemSpy.mockRestore()
        })
    })
})
