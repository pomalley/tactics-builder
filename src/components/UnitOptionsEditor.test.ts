import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import UnitOptionsEditor from './UnitOptionsEditor.vue';
import { toggleUnitOption, selectUnitOptionChoice } from '../store';

vi.mock('../store', () => ({
  toggleUnitOption: vi.fn(),
  selectUnitOptionChoice: vi.fn(),
}));

describe('UnitOptionsEditor Component', () => {
  const mockUnit = {
    id: 'u1',
    name: 'Mock Unit',
    type: 'Infantry' as any,
    selectedOptions: [],
    models: [],
    slots: {},
    extras: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing if no options available', () => {
    const unitNoOptions = { ...mockUnit, type: 'CIM-APP' as any };
    const wrapper = mount(UnitOptionsEditor, {
      props: { unit: unitNoOptions as any },
    });
    expect(wrapper.find('.unit-options').exists()).toBe(false);
  });

  it('renders checkboxes for simple options', () => {
    const wrapper = mount(UnitOptionsEditor, {
      props: { unit: mockUnit as any },
    });
    // Infantry has 'Add Fog Grenades' as a toggle option
    expect(wrapper.text()).toContain('Add Fog Grenades');
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
  });

  it('renders selects for options with choices', () => {
    const wrapper = mount(UnitOptionsEditor, {
      props: { unit: mockUnit as any },
    });
    // Infantry has 'Support Weapon' as a choice option
    expect(wrapper.text()).toContain('Support Weapon');
    expect(wrapper.find('select').exists()).toBe(true);
  });

  it('triggers toggleUnitOption when checkbox is clicked', async () => {
    const wrapper = mount(UnitOptionsEditor, {
      props: { unit: mockUnit as any },
    });
    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(true);
    expect(toggleUnitOption).toHaveBeenCalled();
  });

  it('triggers selectUnitOptionChoice when select value changes', async () => {
    const wrapper = mount(UnitOptionsEditor, {
      props: { unit: mockUnit as any },
    });
    const select = wrapper.find('select');
    await select.setValue('support_lmg');
    expect(selectUnitOptionChoice).toHaveBeenCalled();
  });
});
