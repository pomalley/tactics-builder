<script setup lang="ts">
import { computed } from 'vue';
import type { UnitType } from '../types';
import { lifeformStats, type Lifeform } from '../data/lifeforms';
import { unitGroups, unitOptions } from '../data/units';
import ModelItem from './ModelItem.vue';
import {
  appState,
  armyState,
  addModelToUnit,
  removeModelFromUnit,
  calculateUnitPoints,
  changeUnitType,
  changeUnitLifeform,
  toggleUnitOption,
  selectUnitOptionChoice,
  addSlotToUnit,
  removeSlotFromUnit,
  addExtraToUnit,
  removeExtraFromUnit,
} from '../store';

import EquipmentManager from './EquipmentManager.vue';
import { getOptionDefaultLabel, getChoicePointsLabel, getOptionPointsLabel } from '../logic';

const lifeformTypes = Object.keys(lifeformStats) as Lifeform[];

const unit = computed(() => armyState.units.find((u) => u.id === appState.selectedUnitId));

const unitPoints = computed(() => {
  return unit.value ? calculateUnitPoints(unit.value) : 0;
});

const availableOptions = computed(() => {
  return unit.value ? unitOptions[unit.value.type] || [] : [];
});

const onTypeChange = (event: Event) => {
  if (!unit.value) return;
  const target = event.target as HTMLSelectElement;
  changeUnitType(unit.value.id, target.value as UnitType);
};

const onLifeformChange = (event: Event) => {
  if (!unit.value) return;
  const target = event.target as HTMLSelectElement;
  changeUnitLifeform(unit.value.id, target.value as Lifeform);
};
</script>

<template>
  <div v-if="unit" class="unit-editor card">
    <div class="unit-header">
      <div class="header-main">
        <input
          type="text"
          v-model="unit.name"
          class="input-header unit-name-input"
          placeholder="Unit Name"
        />
        <span class="unit-points points-text">{{ unitPoints }} pts</span>
      </div>
    </div>

    <div class="unit-body">
      <div class="unit-settings">
        <div class="setting-group">
          <label>Type:</label>
          <select :value="unit.type" @change="onTypeChange">
            <optgroup v-for="group in unitGroups" :key="group.label" :label="group.label">
              <option v-for="type in group.types" :key="type" :value="type">
                {{ type }}
              </option>
            </optgroup>
          </select>
        </div>
        <div class="setting-group" v-if="unit.lifeform !== undefined">
          <label>Lifeform:</label>
          <select :value="unit.lifeform" @change="onLifeformChange">
            <option v-for="lf in lifeformTypes" :key="lf" :value="lf">
              {{ lf }}
            </option>
          </select>
        </div>
      </div>

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
                      unit!.id,
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
                  {{ choice.name }}{{ getChoicePointsLabel(choice) }}
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
                  @change="toggleUnitOption(unit!.id, opt.id)"
                />
                {{ opt.name }}{{ getOptionPointsLabel(opt) }}
              </label>
            </div>
          </template>
        </div>
      </div>

      <div class="unit-equipment-container">
        <EquipmentManager
          :target="unit"
          @add-slot="(name, weapon) => addSlotToUnit(unit!.id, name, weapon)"
          @remove-slot="(name) => removeSlotFromUnit(unit!.id, name)"
          @add-extra="(item) => addExtraToUnit(unit!.id, item)"
          @remove-extra="(index) => removeExtraFromUnit(unit!.id, index)"
        />
      </div>

      <div class="models-container">
        <h4 v-if="unit.models.length > 0">Models</h4>
        <div class="models-list">
          <ModelItem
            v-for="model in unit.models"
            :key="model.id"
            :model="model"
            :unitId="unit.id"
            @remove="removeModelFromUnit(unit!.id, $event)"
          />
        </div>
        <button
          v-if="armyState.freeEdit"
          @click="addModelToUnit(unit.id)"
          class="btn btn-secondary add-model-btn"
        >
          + Add Model
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.unit-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.unit-header {
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 2px solid var(--border-color);
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.unit-name-input {
  font-size: 1.25rem;
  flex: 1;
}

.unit-points {
  font-size: 1.25rem;
  color: var(--primary);
  font-weight: bold;
}

.unit-settings {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.setting-group {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.setting-group label {
  font-weight: bold;
  color: var(--text-muted);
}

.models-container h4 {
  margin: 0 0 var(--space-lg) 0;
  color: var(--text-muted);
}

.add-model-btn {
  margin-top: var(--space-sm);
  width: 100%;
}

.unit-options,
.unit-equipment-container {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.unit-options h4,
.unit-equipment-container h4 {
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
