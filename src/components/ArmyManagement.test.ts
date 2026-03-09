import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ArmyManagement from './ArmyManagement.vue';
import * as store from '../store';

// Mock the store functions
vi.mock('../store', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    addArmy: vi.fn(),
    removeArmy: vi.fn(),
    exportArmy: vi.fn(),
    importArmy: vi.fn(),
  };
});

describe('ArmyManagement.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup some basic state for the mocked store
    store.appState.armies = [
      { id: '1', name: 'Army 1', units: [], freeEdit: false, defaultLifeform: 'Human' }
    ];
    store.appState.currentArmyId = '1';
  });

  it('calls addArmy when "+" button is clicked', async () => {
    const wrapper = mount(ArmyManagement);
    await wrapper.find('button[title="New Army"]').trigger('click');
    expect(store.addArmy).toHaveBeenCalled();
  });

  it('calls exportArmy with current army id when export button is clicked', async () => {
    const wrapper = mount(ArmyManagement);
    await wrapper.find('button[title="Export Army"]').trigger('click');
    expect(store.exportArmy).toHaveBeenCalledWith('1');
  });

  it('triggers file input click when import button is clicked', async () => {
    const wrapper = mount(ArmyManagement);
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement;
    const spy = vi.spyOn(input, 'click');
    
    await wrapper.find('button[title="Import Army"]').trigger('click');
    expect(spy).toHaveBeenCalled();
  });

  it('calls removeArmy when delete button is clicked and confirmed', async () => {
    // Mock confirm
    window.confirm = vi.fn().mockReturnValue(true);
    
    // Add another army so delete is not disabled
    store.appState.armies.push({ id: '2', name: 'Army 2', units: [], freeEdit: false, defaultLifeform: 'Human' });
    
    const wrapper = mount(ArmyManagement);
    await wrapper.find('button[title="Delete Army"]').trigger('click');
    
    expect(window.confirm).toHaveBeenCalled();
    expect(store.removeArmy).toHaveBeenCalledWith('1');
  });

  it('does not call removeArmy if delete is cancelled', async () => {
    window.confirm = vi.fn().mockReturnValue(false);
    store.appState.armies.push({ id: '2', name: 'Army 2', units: [], freeEdit: false, defaultLifeform: 'Human' });

    const wrapper = mount(ArmyManagement);
    await wrapper.find('button[title="Delete Army"]').trigger('click');
    
    expect(store.removeArmy).not.toHaveBeenCalled();
  });
});
