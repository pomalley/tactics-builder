<script setup lang="ts">
import { computed } from 'vue';
import type { Unit } from '../types';
import { unitOptions } from '../data/units';
import { toggleUnitOption, selectUnitOptionChoice } from '../store';
import {
  getOptionDefaultLabel,
  getChoicePointsLabel,
  getChoiceStatsLabel,
  getOptionPointsLabel,
  getOptionStatsLabel,
} from '../logic';

const props = defineProps<{
  unit: Unit;
}>();

const availableOptions = computed(() => {
  return unitOptions[props.unit.type] || [];
});
</script>

<template>
  <div class="unit-options" v-if="availableOptions.length > 0">
    <h4>Unit Options</h4>
    <div v-for="opt in availableOptions" :key="opt.id" class="option-item">
      <template v-if="opt.choices">
        <div class="option-select">
          <label :for="opt.id">{{ opt.name }}:</label>
          <select
            :id="opt.id"
            @change="
              (e) =>
                selectUnitOptionChoice(
                  unit.id,
                  opt.id,
                  (e.target as HTMLSelectElement).value || null
                )
            "
          >
            <option v-if="opt.type !== 'slot'" value="">
              {{ getOptionDefaultLabel(opt, unit) }}
            </option>
            <option
              v-for="choice in opt.choices"
              :key="choice.id"
              :value="choice.id"
              :selected="unit.selectedOptions.includes(choice.id)"
            >
              {{ choice.name }}{{ getChoicePointsLabel(choice) }}{{ getChoiceStatsLabel(choice) }}
            </option>
          </select>
        </div>
      </template>
      <template v-else>
        <div class="option-checkbox">
          <label>
            <input
              type="checkbox"
              :checked="unit.selectedOptions.includes(opt.id)"
              @change="toggleUnitOption(unit.id, opt.id)"
            />
            {{ opt.name }}{{ getOptionPointsLabel(opt) }}{{ getOptionStatsLabel(opt) }}
          </label>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.unit-options {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.unit-options h4 {
  margin: 0 0 var(--space-md) 0;
  color: var(--text-muted);
}

.option-item {
  margin-bottom: var(--space-md);
}

.option-select {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.option-select label {
  font-weight: bold;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.option-checkbox {
  margin-bottom: var(--space-sm);
}

.option-checkbox label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.95rem;
}
</style>
