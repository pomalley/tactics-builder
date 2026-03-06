import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import UnitModelList from './UnitModelList.vue';
import { setFreeEdit, addModelToUnit } from '../store';

vi.mock('../store', async () => {
  const actual = (await vi.importActual('../store')) as any;
  return {
    ...actual,
    addModelToUnit: vi.fn(),
  };
});

describe('UnitModelList Component', () => {
  const mockUnit = {
    id: 'u1',
    models: [
      { id: 'm1', name: 'Model 1', slots: {}, extras: [] },
      { id: 'm2', name: 'Model 2', slots: {}, extras: [] },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setFreeEdit(false);
  });

  it('renders all models in the unit', () => {
    const wrapper = mount(UnitModelList, {
      props: { unit: mockUnit as any },
    });
    // Check for ModelItem components (rendered as divs with model-item class usually)
    // Actually we can just check the text if ModelItem renders the name
    expect(wrapper.findAll('.model-item').length).toBe(2);
  });

  it('shows Add Model button only in free edit mode', async () => {
    const wrapper = mount(UnitModelList, {
      props: { unit: mockUnit as any },
    });
    expect(wrapper.find('.add-model-btn').exists()).toBe(false);

    setFreeEdit(true);
    const wrapperEdit = mount(UnitModelList, {
      props: { unit: mockUnit as any },
    });
    expect(wrapperEdit.find('.add-model-btn').exists()).toBe(true);
  });

  it('triggers addModelToUnit when button is clicked', async () => {
    setFreeEdit(true);
    const wrapper = mount(UnitModelList, {
      props: { unit: mockUnit as any },
    });
    await wrapper.find('.add-model-btn').trigger('click');
    expect(addModelToUnit).toHaveBeenCalledWith('u1');
  });
});
