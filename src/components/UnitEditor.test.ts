import { describe, it, expect, beforeEach, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import UnitEditor from './UnitEditor.vue';
import { armyState, addUnitWithType, resetStore } from '../store';

// Mock crypto.randomUUID for jsdom
vi.stubGlobal('crypto', {
  randomUUID: () => Math.random().toString(36).substring(2),
});

describe('UnitEditor Component', () => {
  beforeEach(() => {
    resetStore({
      armies: [
        {
          id: 'test-army-id',
          name: 'Test Army',
          units: [],
          freeEdit: false,
          defaultLifeform: 'Human',
        },
      ],
      currentArmyId: 'test-army-id',
      selectedUnitId: null,
    });
    addUnitWithType('Infantry'); // Adds an Infantry unit and selects it
  });

  it('renders unit basic info', async () => {
    const wrapper = mount(UnitEditor);
    await nextTick();

    expect((wrapper.find('.unit-name-input').element as HTMLInputElement).value).toBe(
      'New Infantry'
    );
    expect(wrapper.find('.unit-points').text()).toBe('82 pts');
  });

  it('changes unit type', async () => {
    const unit = armyState.units[0];
    const wrapper = mount(UnitEditor);
    await nextTick();

    const typeSelect = wrapper.find('select'); // First select is Type
    await typeSelect.setValue('Recon');

    expect(unit.type).toBe('Recon');
    expect(wrapper.find('.unit-points').text()).toBe('78 pts');
  });

  it('toggles unit option', async () => {
    const unit = armyState.units[0];
    const wrapper = mount(UnitEditor);
    await nextTick();

    // Find "Add Fog Grenades" checkbox
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    const fogGrenadeCheckbox = checkboxes.find((c) => {
      const label = c.element.parentElement?.textContent;
      return label?.includes('Add Fog Grenades');
    });

    expect(fogGrenadeCheckbox).toBeDefined();
    await fogGrenadeCheckbox!.setValue(true);

    expect(unit.selectedOptions).toContain('fog_grenades');
    // Infantry 82 + 5 models * 1 pt = 87
    expect(wrapper.find('.unit-points').text()).toBe('87 pts');
  });

  it('selects unit option choice', async () => {
    const unit = armyState.units[0];
    const wrapper = mount(UnitEditor);
    await nextTick();

    // Find Support Weapon select
    const selects = wrapper.findAll('select');
    const supportSelect = selects.find((s) => {
      const label = s.element.parentElement?.querySelector('label')?.textContent;
      return label?.includes('Support Weapon');
    });

    expect(supportSelect).toBeDefined();
    await supportSelect!.setValue('support_plasma_rifle');

    expect(unit.selectedOptions).toContain('support_plasma_rifle');
    // Trooper 4 swap LMG(10) for Plasma Rifle(8) = -2 pts -> 80
    expect(wrapper.find('.unit-points').text()).toBe('80 pts');
  });

  it('hides lifeform dropdown for vehicle units', async () => {
    const { changeUnitType } = await import('../store');
    const unit = armyState.units[0];
    changeUnitType(unit.id, 'Nomad Bike');
    await nextTick();

    const wrapper = mount(UnitEditor);
    await nextTick();

    // Should have Type select but no Lifeform select
    const settingGroups = wrapper.findAll('.setting-group');
    expect(settingGroups.length).toBe(1); // only Type
    const labels = settingGroups.map((g) => g.find('label').text());
    expect(labels).toContain('Type:');
    expect(labels).not.toContain('Lifeform:');
  });
});
