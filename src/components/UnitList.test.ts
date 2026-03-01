import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import UnitList from './UnitList.vue'
import { appState, armyState, resetStore } from '../store'

// Mock crypto.randomUUID for jsdom
vi.stubGlobal('crypto', {
    randomUUID: () => Math.random().toString(36).substring(2)
});

describe('UnitList Component', () => {
    beforeEach(() => {
        resetStore({
            armies: [{
                id: 'test-army-id',
                name: 'Test Army',
                units: [],
                freeEdit: false
            }],
            currentArmyId: 'test-army-id'
        })
    })

    it('renders the army name and total points', () => {
        const wrapper = mount(UnitList)
        expect(wrapper.find('.army-name-input').element instanceof HTMLInputElement).toBe(true)
        expect((wrapper.find('.army-name-input').element as HTMLInputElement).value).toBe('Test Army')
        expect(wrapper.find('.total-points').text()).toContain('0 pts')
    })

    it('adds a unit when the button is clicked', async () => {
        const wrapper = mount(UnitList)
        const addButton = wrapper.find('.add-unit-btn')
        
        await addButton.trigger('click')
        
        expect(armyState.units.length).toBe(1)
        expect(wrapper.findAll('.unit-item').length).toBe(1)
    })

    it('updates total points when a unit is added', async () => {
        const wrapper = mount(UnitList)
        const addButton = wrapper.find('.add-unit-btn')
        
        await addButton.trigger('click')
        
        // Total points should be > 0 (Infantry is 82 pts)
        expect(wrapper.find('.total-points').text()).toContain('82 pts')
    })

    describe('Multi-Army UI', () => {
        it('switches armies via the selector', async () => {
            const wrapper = mount(UnitList)
            
            // Add a second army
            const { addArmy } = await import('../store')
            addArmy() // This selects the new army
            await nextTick()
            
            const select = wrapper.find('#army-select')
            expect((select.element as HTMLSelectElement).value).not.toBe('test-army-id')

            // Switch back to the first army
            await select.setValue('test-army-id')
            expect(armyState.id).toBe('test-army-id')
            expect((wrapper.find('.army-name-input').element as HTMLInputElement).value).toBe('Test Army')
        })

        it('adds a new army via the button', async () => {
            const wrapper = mount(UnitList)
            const addArmyBtn = wrapper.find('.add-army-btn')
            
            await addArmyBtn.trigger('click')
            
            expect(appState.armies.length).toBe(2)
            expect(armyState.name).toBe('New Army')
            expect((wrapper.find('.army-name-input').element as HTMLInputElement).value).toBe('New Army')
        })
    })
})
