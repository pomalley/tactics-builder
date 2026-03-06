import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import EquipmentManager from './EquipmentManager.vue';
import { setFreeEdit } from '../store';

describe('EquipmentManager Component', () => {
  const mockTarget = {
    slots: { primary: 'Military Rifle' as any },
    extras: ['Frag Grenade' as any],
  };

  const props = {
    target: mockTarget,
    onAddSlot: vi.fn(),
    onRemoveSlot: vi.fn(),
    onAddExtra: vi.fn(),
    onRemoveExtra: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setFreeEdit(false);
  });

  it('renders equipment in readonly mode', () => {
    const wrapper = mount(EquipmentManager, { props });

    expect(wrapper.find('.slot-name').text()).toBe('Primary:');
    expect(wrapper.find('.weapon-name').text()).toBe('Military Rifle');
    expect(wrapper.find('.weapon-points').text()).toBe('[3]');

    // Extras
    expect(wrapper.findAll('.equipment-item')[1].text()).toContain('Frag Grenade');

    // No remove buttons or selects
    expect(wrapper.find('.mini-remove-btn').exists()).toBe(false);
    expect(wrapper.find('select').exists()).toBe(false);
  });

  it('renders selects and remove buttons in free edit mode', async () => {
    setFreeEdit(true);
    const wrapper = mount(EquipmentManager, { props });

    expect(wrapper.find('select').exists()).toBe(true);
    expect(wrapper.find('.mini-remove-btn').exists()).toBe(true);
    expect(wrapper.find('.manual-add-controls').exists()).toBe(true);
  });

  it('triggers callbacks when equipment is modified', async () => {
    setFreeEdit(true);
    const wrapper = mount(EquipmentManager, { props });

    // Trigger slot removal
    const removeBtns = wrapper.findAll('.mini-remove-btn');
    await removeBtns[0].trigger('click');
    expect(props.onRemoveSlot).toHaveBeenCalledWith('primary');

    // Trigger extra removal
    await removeBtns[1].trigger('click');
    expect(props.onRemoveExtra).toHaveBeenCalledWith(0);

    // Trigger extra addition
    const addExtraBtn = wrapper.find('.add-manual-btn:last-child');
    await addExtraBtn.trigger('click');
    expect(props.onAddExtra).toHaveBeenCalledWith('None');
  });

  it('triggers slot change when select is updated', async () => {
    setFreeEdit(true);
    const wrapper = mount(EquipmentManager, { props });

    const select = wrapper.find('select');
    await select.setValue('Shotgun');

    expect(props.onAddSlot).toHaveBeenCalledWith('primary', 'Shotgun');
  });
});
