import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import ArmyList from './ArmyList.vue'
import { appState, armyState, resetStore } from '../store'

// Mock crypto.randomUUID for jsdom
vi.stubGlobal('crypto', {
    randomUUID: () => Math.random().toString(36).substring(2)
});

describe('ArmyList Component', () => {
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

    it('renders the army name and total points', () => {
        const wrapper = mount(ArmyList)
        expect(wrapper.find('.army-name-input').element instanceof HTMLInputElement).toBe(true)
        expect((wrapper.find('.army-name-input').element as HTMLInputElement).value).toBe('Test Army')
        expect(wrapper.find('.total-points').text()).toContain('0 pts')
    })

    describe('Multi-Army UI', () => {
        it('switches armies via the selector', async () => {
            const wrapper = mount(ArmyList)
            
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
            const wrapper = mount(ArmyList)
            const addArmyBtns = wrapper.findAll('button')
            const addArmyBtn = addArmyBtns.find(b => b.text().includes('+'))!
            
            await addArmyBtn.trigger('click')
            
            expect(appState.armies.length).toBe(2)
            expect(armyState.name).toBe('New Army')
            expect((wrapper.find('.army-name-input').element as HTMLInputElement).value).toBe('New Army')
        })
    })

    it('displays unit summaries and allows selection', async () => {
        const { addUnitWithType } = await import('../store')
        addUnitWithType('Infantry')
        await nextTick()

        const wrapper = mount(ArmyList)
        
        const cards = wrapper.findAll('.unit-summary-card')
        expect(cards.length).toBe(1)
        expect(cards[0].text()).toContain('New Infantry')
        
        await cards[0].trigger('click')
        expect(appState.selectedUnitId).toBe(armyState.units[0].id)
    })
})
