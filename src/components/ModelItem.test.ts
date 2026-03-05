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
    })
    
    it('renders model stats', () => {
        const unit = armyState.units[0]
        const model = unit.models[0] // Sergeant (Human Minor Character)
        const wrapper = mount(ModelItem, {
            props: { model, unitId: unit.id }
        })

        // Human Minor Character stats: SPD 4" (updated), REA 2, CS 1, TGH 3, KP 2, SAV 0, TRN 2
        const stats = wrapper.findAll('.stat-box')
        expect(stats.length).toBe(7) // non-vehicle
        expect(stats[0].text()).toContain('SPD4"')
        expect(stats[1].text()).toContain('REA2')
        expect(stats[2].text()).toContain('CS1')
        expect(stats[3].text()).toContain('TGH3')
        expect(stats[4].text()).toContain('KP2')
        expect(stats[5].text()).toContain('SAV0')
        expect(stats[6].text()).toContain('TRN2')
    })
    
    it('renders vehicle stats', () => {
        const unit = armyState.units[0]
        unit.models.push({
            id: 'test-vehicle',
            name: 'Tank',
            lifeform: undefined,
            baseStats: { points: 100, speed: 10, reaction: 3, combatSkill: 4, toughness: 8, killPoints: 5, savvy: 0, training: 4, crew: 2, capacity: 0 },
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
