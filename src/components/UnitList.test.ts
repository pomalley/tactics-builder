import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UnitList from './UnitList.vue'
import { armyState } from '../store'

// Mock crypto.randomUUID for jsdom
if (!global.crypto) {
  (global as any).crypto = {
    randomUUID: () => Math.random().toString(36).substring(2)
  };
}

describe('UnitList Component', () => {
    beforeEach(() => {
        armyState.units = []
        armyState.name = 'Test Army'
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
        // UnitItem should be rendered (we can check for its existence)
        // Since UnitItem is imported directly, it will be rendered.
        expect(wrapper.findAll('.unit-item').length).toBe(1)
    })

    it('updates total points when a unit is added', async () => {
        const wrapper = mount(UnitList)
        const addButton = wrapper.find('.add-unit-btn')
        
        await addButton.trigger('click')
        
        // Total points should be > 0 (Infantry is 82 pts)
        expect(wrapper.find('.total-points').text()).toContain('82 pts')
    })
})
