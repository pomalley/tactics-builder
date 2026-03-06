import { computed } from 'vue';
import { appState, armyState } from '../store';
import { calculateUnitPoints } from '../logic';
import type { Unit } from '../types';

export function useCurrentUnit() {
  const unit = computed(() =>
    armyState.units.find((u: Unit) => u.id === appState.selectedUnitId)
  );

  const unitPoints = computed(() => {
    return unit.value ? calculateUnitPoints(unit.value) : 0;
  });

  return {
    unit,
    unitPoints,
  };
}
