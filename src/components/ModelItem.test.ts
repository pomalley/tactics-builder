import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ModelItem from './ModelItem.vue'
import { armyState, addUnitWithType, setFreeEdit, resetStore } from '../store'

// Mock crypto.randomUUID for jsdom
vi.stubGlobal('crypto', {
    randomUUID: () => Math.random().toString(36).substring(2)
});

describe('ModelItem Component', () => {
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
        setFreeEdit(false)
        addUnitWithType('Infantry') // Adds an Infantry unit
    })

    it('renders model basic info', () => {
        const unit = armyState.units[0]
        const model = unit.models[0]
        const wrapper = mount(ModelItem, {
            props: { model, unitId: unit.id }
        })

        expect((wrapper.find('.model-name-input').element as HTMLInputElement).value).toBe('Sergeant')
        // Points for Sergeant (Minor Character (15) + rifle (3) + grenade (1) = 19)
        expect(wrapper.find('.points-field .readonly-text').text()).toBe('19')
    })

    it('updates model name', async () => {
        const unit = armyState.units[0]
        const model = unit.models[0]
        const wrapper = mount(ModelItem, {
            props: { model, unitId: unit.id }
        })

        const nameInput = wrapper.find('.model-name-input')
        await nameInput.setValue('Special Sergeant')

        expect(model.name).toBe('Special Sergeant')
    })

    it('renders free edit mode controls', async () => {
        setFreeEdit(true)
        const unit = armyState.units[0]
        const model = unit.models[0]
        const wrapper = mount(ModelItem, {
            props: { model, unitId: unit.id }
        })

        // Should have a remove button
        expect(wrapper.find('.remove-btn').exists()).toBe(true)
        // Should have a base points input
        expect(wrapper.find('.mini-pts-input').exists()).toBe(true)
        // Should have an inline select for class
        expect(wrapper.find('.inline-select').exists()).toBe(true)
    })

    it('updates model class and base points in free edit', async () => {
        setFreeEdit(true)
        const unit = armyState.units[0]
        const model = unit.models[0]
        const wrapper = mount(ModelItem, {
            props: { model, unitId: unit.id }
        })

        const classSelect = wrapper.find('.inline-select')
        await classSelect.setValue('Major Character')
        expect(model.class).toBe('Major Character')

        const ptsInput = wrapper.find('.mini-pts-input')
        await ptsInput.setValue('50')
        expect(model.basePoints).toBe(50)
        
        // Total points: 50 + 3 + 1 = 54
        expect(wrapper.find('.points-field .readonly-text').text()).toBe('54')
    })
})
