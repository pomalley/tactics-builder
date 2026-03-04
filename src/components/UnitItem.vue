<script setup lang="ts">
import { computed } from "vue";
import type { Unit, UnitType } from "../types";
import { lifeformClassPoints, type Lifeform } from "../data/lifeforms";
import { unitGroups, unitOptions } from "../data/units";
import ModelItem from "./ModelItem.vue";
import {
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
  toggleUnitMinimized,
  moveUnit,
} from "../store";

import EquipmentManager from "./EquipmentManager.vue";
import { getOptionDefaultLabel, getChoicePointsLabel, getOptionPointsLabel } from "../logic";

const props = defineProps<{
  unit: Unit;
}>();

const isFirst = computed(() => armyState.units[0]?.id === props.unit.id);
const isLast = computed(() => armyState.units[armyState.units.length - 1]?.id === props.unit.id);

const lifeformTypes = Object.keys(lifeformClassPoints) as Lifeform[];

const emit = defineEmits<{
  (e: "remove", unitId: string): void;
}>();

const unitPoints = computed(() => {
  return calculateUnitPoints(props.unit);
});

const availableOptions = computed(() => unitOptions[props.unit.type] || []);

const onTypeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  changeUnitType(props.unit.id, target.value as UnitType);
};

const onLifeformChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  changeUnitLifeform(props.unit.id, target.value as Lifeform);
};
</script>

<template>
  <div class="unit-item card">
    <div class="unit-header">
      <div class="header-main">
        <button 
          @click="toggleUnitMinimized(unit.id)" 
          class="btn btn-ghost toggle-btn"
          :title="unit.minimized ? 'Expand' : 'Collapse'"
        >
          {{ unit.minimized ? '▶' : '▼' }}
        </button>
        <input
          type="text"
          v-model="unit.name"
          class="unit-name-input"
          placeholder="Unit Name"
        />
      </div>
      <div class="unit-actions">
        <div class="move-btns">
          <button 
            @click="moveUnit(unit.id, 'up')" 
            :disabled="isFirst" 
            class="btn btn-secondary move-btn"
            title="Move Up"
          >
            ↑
          </button>
          <button 
            @click="moveUnit(unit.id, 'down')" 
            :disabled="isLast" 
            class="btn btn-secondary move-btn"
            title="Move Down"
          >
            ↓
          </button>
        </div>
        <span class="unit-points points-text">{{ unitPoints }} pts</span>
        <button @click="emit('remove', unit.id)" class="btn btn-danger">
          Delete Unit
        </button>
      </div>
    </div>

    <div v-if="unit.minimized" class="unit-body unit-summary">
      {{ unit.type }} - {{ unit.lifeform }}
    </div>
    <div v-else="!unit.minimized" class="unit-body">
      <div class="unit-settings">
        <div class="setting-group">
          <label>Type:</label>
          <select :value="unit.type" @change="onTypeChange">
            <optgroup
              v-for="group in unitGroups"
              :key="group.label"
              :label="group.label"
            >
              <option v-for="type in group.types" :key="type" :value="type">
                {{ type }}
              </option>
            </optgroup>
          </select>
        </div>
        <div class="setting-group">
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
        <div
          v-for="opt in availableOptions"
          :key="opt.id"
          class="option-item"
        >
          <template v-if="opt.choices">
            <div class="option-select">
              <label :for="opt.id">{{ opt.name }}:</label>
              <select
                :id="opt.id"
                @change="(e) => selectUnitOptionChoice(unit.id, opt.id, (e.target as HTMLSelectElement).value || null)"
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
                  @change="toggleUnitOption(unit.id, opt.id)"
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
          @add-slot="(name, weapon) => addSlotToUnit(unit.id, name, weapon)"
          @remove-slot="(name) => removeSlotFromUnit(unit.id, name)"
          @add-extra="(item) => addExtraToUnit(unit.id, item)"
          @remove-extra="(index) => removeExtraFromUnit(unit.id, index)"
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
            @remove="removeModelFromUnit(unit.id, $event)"
          />
        </div>
        <button v-if="armyState.freeEdit" @click="addModelToUnit(unit.id)" class="btn btn-secondary add-model-btn">
          + Add Model
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.unit-item {
  margin-bottom: var(--space-lg);
}

.unit-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 2px solid var(--border-color);
}

@media (min-width: 600px) {
  .unit-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-md);
  }
}

.header-main {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
}

.toggle-btn {
  width: 24px;
  height: 24px;
  padding: 0;
}

.unit-settings {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

@media (min-width: 600px) {
  .unit-settings {
    gap: var(--space-lg);
    margin-bottom: var(--space-lg);
  }
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

.unit-name-input {
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  background: transparent;
  flex: 1;
  color: var(--text-main);
}

.unit-name-input:focus {
  outline: none;
  border-bottom: 2px solid var(--primary);
}

.unit-actions {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.move-btns {
  display: flex;
  gap: var(--space-xs);
}

.move-btn {
  width: 28px;
  height: 28px;
  padding: 0;
}

.unit-points {
  font-size: 1.1rem;
}

.models-container h4 {
  margin: 0 0 var(--space-lg) 0;
  color: var(--text-muted);
}

.add-model-btn {
  margin-top: var(--space-sm);
  width: 100%;
}

.unit-options, .unit-equipment {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.unit-options h4, .unit-equipment h4 {
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

.unit-summary {
  font-weight: bold;
  color: var(--text-muted);
  font-size: 0.95rem;
}
</style>
