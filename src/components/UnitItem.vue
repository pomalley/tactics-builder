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
  <div class="unit-item">
    <div class="unit-header">
      <div class="header-main">
        <button 
          @click="toggleUnitMinimized(unit.id)" 
          class="toggle-btn"
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
            class="move-btn"
            title="Move Up"
          >
            ↑
          </button>
          <button 
            @click="moveUnit(unit.id, 'down')" 
            :disabled="isLast" 
            class="move-btn"
            title="Move Down"
          >
            ↓
          </button>
        </div>
        <span class="unit-points">{{ unitPoints }} pts</span>
        <button @click="emit('remove', unit.id)" class="remove-btn">
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
        <button v-if="armyState.freeEdit" @click="addModelToUnit(unit.id)" class="add-model-btn">
          + Add Model
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.unit-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
  .unit-item {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
}

@media (prefers-color-scheme: dark) {
  .unit-item {
    background-color: #1e1e1e;
    border-color: #333;
  }
}

.unit-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

@media (min-width: 600px) {
  .unit-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
}

.header-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

@media (prefers-color-scheme: dark) {
  .toggle-btn {
    color: #aaa;
  }
}

.toggle-btn:hover {
  color: #4caf50;
}

@media (prefers-color-scheme: dark) {
  .unit-header {
    border-bottom-color: #333;
  }
}

.unit-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

@media (min-width: 600px) {
  .unit-settings {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

@media (prefers-color-scheme: dark) {
  .unit-settings {
    border-bottom-color: #333;
  }
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-group label {
  font-weight: bold;
  color: #555;
}

@media (prefers-color-scheme: dark) {
  .setting-group label {
    color: #ccc;
  }
}

.setting-group select {
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-family: inherit;
}

@media (prefers-color-scheme: dark) {
  .setting-group select {
    background-color: #333;
    color: white;
    border-color: #555;
  }
}

.unit-name-input {
  font-size: 1.25rem;
  font-weight: 700;
  border: none;
  background: transparent;
  flex: 1;
}

@media (min-width: 768px) {
  .unit-name-input {
    font-size: 1.5rem;
  }
}

.unit-name-input:focus {
  outline: none;
  border-bottom: 2px solid #4caf50;
}

.unit-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.move-btns {
  display: flex;
  gap: 0.25rem;
}

.move-btn {
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .move-btn {
    background: #333;
    border-color: #555;
    color: #ccc;
  }
}

.move-btn:hover:not(:disabled) {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.unit-points {
  font-size: 1.25rem;
  font-weight: bold;
  color: #4caf50;
}

.remove-btn {
  background-color: #ff5252;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.remove-btn:hover {
  background-color: #ff1744;
}

.models-container h4 {
  margin: 0 0 1rem 0;
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .models-container h4 {
    color: #aaa;
  }
}

.add-model-btn {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 0.5rem;
  width: 100%;
}

@media (prefers-color-scheme: dark) {
  .add-model-btn {
    background-color: #333;
    color: #eee;
  }
}

.add-model-btn:hover {
  background-color: #d0d0d0;
}

@media (prefers-color-scheme: dark) {
  .add-model-btn:hover {
    background-color: #444;
  }
}

.unit-options {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

@media (prefers-color-scheme: dark) {
  .unit-options {
    border-bottom-color: #333;
  }
}

.unit-options h4, .unit-equipment h4 {
  margin: 0 0 0.75rem 0;
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .unit-options h4, .unit-equipment h4 {
    color: #ccc;
  }
}

.unit-equipment {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

@media (prefers-color-scheme: dark) {
  .unit-equipment {
    border-bottom-color: #333;
  }
}

.equipment-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.slot-name {
  font-weight: bold;
  text-transform: capitalize;
}

.weapon-points {
  color: #4caf50;
  font-size: 0.85rem;
}

.option-item {
  margin-bottom: 0.75rem;
}

.option-select {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-select label {
  font-weight: bold;
  color: #555;
  font-size: 0.95rem;
}

@media (prefers-color-scheme: dark) {
  .option-select label {
    color: #ccc;
  }
}

.option-select select {
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-family: inherit;
  font-size: 0.9rem;
  flex: 1;
}

@media (prefers-color-scheme: dark) {
  .option-select select {
    background-color: #333;
    color: white;
    border-color: #555;
  }
}

.option-checkbox {
  margin-bottom: 0.5rem;
}

.option-checkbox label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.mini-remove-btn {
  background: #ff5252;
  color: white;
  border: none;
  border-radius: 4px;
  width: 1.2rem;
  height: 1.2rem;
  line-height: 1rem;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-select {
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.85rem;
}

@media (prefers-color-scheme: dark) {
  .mini-select {
    background-color: #333;
    color: white;
    border-color: #555;
  }
}

.manual-add-controls {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.add-manual-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
}

.add-manual-btn:hover {
  background: #45a049;
}

.unit-summary {
  font-weight: bold;
  color: #555;
  font-size: 0.95rem;
}

@media (prefers-color-scheme: dark) {
  .unit-summary {
    color: #ccc;
  }
}
</style>
