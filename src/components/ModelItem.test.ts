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
    
    it('renders model stats', () => {
        const unit = armyState.units[0]
        const model = unit.models[0] // Sergeant (Human Minor Character)
        const wrapper = mount(ModelItem, {
            props: { model, unitId: unit.id }
        })

        // Human Minor Character stats: SPD 6", REA 5, CS 5, TGH 4, KP 1, SAV 4, TRN 5
        const stats = wrapper.findAll('.stat-box')
        expect(stats.length).toBe(7) // non-vehicle
        expect(stats[0].text()).toContain('SPD6"')
        expect(stats[1].text()).toContain('REA5')
        expect(stats[2].text()).toContain('CS5')
        expect(stats[3].text()).toContain('TGH4')
        expect(stats[4].text()).toContain('KP1')
        expect(stats[5].text()).toContain('SAV4')
        expect(stats[6].text()).toContain('TRN5')
    })
    
    it('renders vehicle stats', () => {
        const unit = armyState.units[0]
        unit.models.push({
            id: 'test-vehicle',
            name: 'Tank',
            lifeform: 'Human',
            class: 'Vehicle',
            slots: {},
            extras: []
        });
        const model = unit.models[unit.models.length - 1]
        const wrapper = mount(ModelItem, {
            props: { model, unitId: unit.id }
        })

        const stats = wrapper.findAll('.stat-box')
        expect(stats.length).toBe(9) // vehicle has 9 stats
        expect(stats[7].text()).toContain('CRW2')
        expect(stats[8].text()).toContain('CAP0')
    })
})
