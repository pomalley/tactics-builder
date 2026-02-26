import { describe, it, expect, beforeEach } from 'vitest'
import { armyState, addUnit, toggleUnitOption, selectUnitOptionChoice, calculateModelPoints, totalArmyPoints } from './store'

describe('Army Store', () => {
    beforeEach(() => {
        armyState.units = []
        armyState.name = 'Test Army'
    })

    it('should add a unit with default models', () => {
        addUnit()
        expect(armyState.units.length).toBe(1)
        expect(armyState.units[0].models.length).toBeGreaterThan(0)
    })

    it('should calculate model points correctly', () => {
        addUnit() // Default is Infantry for Human
        const model = armyState.units[0].models[0] // Sergeant
        // Human Minor Character is 15.
        // Slots: rifle: 'Military Rifle' (3).
        // Extras: 'Frag Grenade' (1).
        // Total: 15 + 3 + 1 = 19.
        expect(calculateModelPoints(model)).toBe(19)
    })

    it('should deduplicate extras when multiple options add the same item', () => {
        addUnit() // Add Infantry
        const unit = armyState.units[0]
        
        let trooper4 = unit.models.find(m => m.name === 'Trooper 4')!
        
        // Initial state: Trooper 4 has Frag Grenade
        expect(trooper4.extras).toContain('Frag Grenade')
        expect(trooper4.extras).not.toContain('Fog Grenade')

        // 1. Toggle Fog Grenades option (this is a toggle)
        toggleUnitOption(unit.id, 'fog_grenades')
        trooper4 = unit.models.find(m => m.name === 'Trooper 4')!
        expect(trooper4.extras.filter(x => x === 'Fog Grenade').length).toBe(1)

        // 2. Select Grenade Launcher (which is a choice in the infantry_support_slot)
        selectUnitOptionChoice(unit.id, 'infantry_support_slot', 'support_grenade_launcher')
        trooper4 = unit.models.find(m => m.name === 'Trooper 4')!
        
        // Should still only have ONE Fog Grenade
        expect(trooper4.extras.filter(x => x === 'Fog Grenade').length).toBe(1)
        
        // Points check for Trooper 4
        // Human Soldier (10)
        // Slot: support: 'Grenade Launcher' (10)
        // Extras: 'Frag Grenade' (1), 'Fog Grenade' (1)
        // Total: 10 + 10 + 1 + 1 = 22
        expect(calculateModelPoints(trooper4)).toBe(22)
    })

    it('should update total army points when units are modified', () => {
        addUnit() 
        const initialPoints = totalArmyPoints.value
        expect(initialPoints).toBeGreaterThan(0)

        addUnit()
        expect(totalArmyPoints.value).toBe(initialPoints * 2)
    })
})
