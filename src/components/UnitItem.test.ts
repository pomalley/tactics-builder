import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UnitItem from './UnitItem.vue'
import { armyState, addUnit, resetStore } from '../store'

// Mock crypto.randomUUID for jsdom
vi.stubGlobal('crypto', {
    randomUUID: () => Math.random().toString(36).substring(2)
});

describe('UnitItem Component', () => {
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
        addUnit() // Adds an Infantry unit
    })

    it('renders unit basic info', () => {
        const unit = armyState.units[0]
        const wrapper = mount(UnitItem, {
            props: { unit }
        })

        expect((wrapper.find('.unit-name-input').element as HTMLInputElement).value).toBe('New Unit')
        expect(wrapper.find('.unit-points').text()).toBe('82 pts')
    })

    it('changes unit type', async () => {
        const unit = armyState.units[0]
        const wrapper = mount(UnitItem, {
            props: { unit }
        })

        const typeSelect = wrapper.find('select') // First select is Type
        await typeSelect.setValue('Recon')

        expect(unit.type).toBe('Recon')
        expect(wrapper.find('.unit-points').text()).toBe('78 pts')
    })

    it('toggles unit option', async () => {
        const unit = armyState.units[0]
        const wrapper = mount(UnitItem, {
            props: { unit }
        })

        // Find "Add Fog Grenades" checkbox
        const checkboxes = wrapper.findAll('input[type="checkbox"]')
        const fogGrenadeCheckbox = checkboxes.find(c => {
            const label = c.element.parentElement?.textContent
            return label?.includes('Add Fog Grenades')
        })

        expect(fogGrenadeCheckbox).toBeDefined()
        await fogGrenadeCheckbox!.setValue(true)

        expect(unit.selectedOptions).toContain('fog_grenades')
        // Infantry 82 + 5 models * 1 pt = 87
        expect(wrapper.find('.unit-points').text()).toBe('87 pts')
    })

    it('selects unit option choice', async () => {
        const unit = armyState.units[0]
        const wrapper = mount(UnitItem, {
            props: { unit }
        })

        // Find Support Weapon select
        const selects = wrapper.findAll('select')
        // Based on template order: Type, Lifeform, then Options
        const supportSelect = selects.find(s => {
            const label = s.element.parentElement?.querySelector('label')?.textContent
            return label?.includes('Support Weapon')
        })

        expect(supportSelect).toBeDefined()
        await supportSelect!.setValue('support_plasma_rifle')

        expect(unit.selectedOptions).toContain('support_plasma_rifle')
        // Trooper 4 swap LMG(10) for Plasma Rifle(8) = -2 pts
        // 82 - 2 = 80
        expect(wrapper.find('.unit-points').text()).toBe('80 pts')
    })

    it('minimizes and expands', async () => {
        const unit = armyState.units[0]
        const wrapper = mount(UnitItem, {
            props: { unit }
        })

        const toggleBtn = wrapper.find('.toggle-btn')
        await toggleBtn.trigger('click')

        expect(unit.minimized).toBe(true)
        expect(wrapper.find('.unit-summary').exists()).toBe(true)
        expect(wrapper.find('.unit-settings').exists()).toBe(false)

        await toggleBtn.trigger('click')
        expect(unit.minimized).toBe(false)
        expect(wrapper.find('.unit-settings').exists()).toBe(true)
    })
})
