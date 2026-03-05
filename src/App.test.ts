import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import App from './App.vue'
import { armyState, resetStore, addUnitWithType, selectUnit } from './store'

// Mock crypto.randomUUID for jsdom
vi.stubGlobal('crypto', {
    randomUUID: () => Math.random().toString(36).substring(2)
});

describe('App Component Layout', () => {
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

    it('renders the main layout and generic catalog/army lists', () => {
        const wrapper = mount(App)
        
        // Assert header exists
        expect(wrapper.find('h1').text()).toBe('5PFH: Tactics Army Builder')

        // Assert our basic three columns are structurally there
        expect(wrapper.find('.catalog-column').exists()).toBe(true)
        expect(wrapper.find('.army-column').exists()).toBe(true)
        expect(wrapper.find('.unit-column').exists()).toBe(true)

        // Initially on mobile view, the army column is active
        expect(wrapper.find('.catalog-column').classes()).not.toContain('mobile-active')
        expect(wrapper.find('.army-column').classes()).toContain('mobile-active')
        expect(wrapper.find('.unit-column').classes()).not.toContain('mobile-active')
    })

    it('changes mobile active column when nav buttons are clicked', async () => {
        const wrapper = mount(App)
        
        // Find nav buttons
        const navButtons = wrapper.findAll('.nav-btn')
        const catalogBtn = navButtons.find(b => b.text() === 'Catalog')!
        const armyBtn = navButtons.find(b => b.text() === 'Army')!
        const unitBtn = navButtons.find(b => b.text() === 'Unit')!

        expect(unitBtn.attributes('disabled')).toBeDefined() // Disabled when selectedUnitId is null

        await catalogBtn.trigger('click')
        expect(wrapper.find('.catalog-column').classes()).toContain('mobile-active')
        expect(wrapper.find('.army-column').classes()).not.toContain('mobile-active')
        
        // Now mock a unit selection so Unit button is enabled
        addUnitWithType('Infantry')
        selectUnit(armyState.units[0].id)
        await nextTick()

        // As soon as a unit is selected, the watch triggers switching to the unit view
        expect(wrapper.find('.unit-column').classes()).toContain('mobile-active')

        // Can click army again
        await armyBtn.trigger('click')
        expect(wrapper.find('.army-column').classes()).toContain('mobile-active')
        expect(wrapper.find('.unit-column').classes()).not.toContain('mobile-active')
    })
})
