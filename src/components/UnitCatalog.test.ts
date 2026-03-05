import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UnitCatalog from './UnitCatalog.vue'
import { resetStore } from '../store'

// Mock crypto.randomUUID for jsdom
vi.stubGlobal('crypto', {
    randomUUID: () => Math.random().toString(36).substring(2)
});

// Since UnitCatalog calls addUnitWithType, we should verify it triggers the store action.
// However, the action modifies the reactive store, so we can just check the store state.

describe('UnitCatalog Component', () => {
    beforeEach(() => {
        resetStore({
            armies: [{
                id: 'test-army-id',
                name: 'Test Army',
                units: [],
                freeEdit: false,
                defaultLifeform: 'Human'
            }],
            currentArmyId: 'test-army-id',
            selectedUnitId: null
        })
    })

    it('renders unit groups and buttons', () => {
        const wrapper = mount(UnitCatalog)
        
        // Check that at least some groups are rendered
        const groups = wrapper.findAll('.catalog-group')
        expect(groups.length).toBeGreaterThan(0)

        // Check that it contains expected text
        expect(wrapper.text()).toContain('Squads')
        expect(wrapper.text()).toContain('Infantry')
    })

    it('adds a unit when a unit button is clicked', async () => {
        const wrapper = mount(UnitCatalog)
        
        // Find the button for Infantry
        const buttons = wrapper.findAll('.add-type-btn')
        const infantryBtn = buttons.find(b => b.text().includes('Infantry'))!
        
        expect(infantryBtn).toBeDefined()
        
        await infantryBtn.trigger('click')
        
        // Check if the store was updated
        const { appState, armyState } = await import('../store')
        expect(armyState.units.length).toBe(1)
        expect(armyState.units[0].type).toBe('Infantry')
        expect(appState.selectedUnitId).toBe(armyState.units[0].id)
    })
})
