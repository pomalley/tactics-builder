<script setup lang="ts">
import type { Model, ModelClass } from "../types";
import { 
  calculateModelPoints, 
  armyState,
  updateModelClass,
  updateModelBasePoints,
  addSlotToModel,
  removeSlotFromModel,
  addExtraToModel,
  removeExtraFromModel
} from "../store";
import { lifeformClassPoints } from "../data/lifeforms";

import EquipmentManager from "./EquipmentManager.vue";

const props = defineProps<{
  model: Model;
  unitId: string;
}>();

const modelClasses: ModelClass[] = ['Civilian', 'Soldier', 'Minor Character', 'Major Character', 'Epic Character', 'Vehicle'];

const emit = defineEmits<{
  (e: "remove", modelId: string): void;
}>();

const handleRemove = () => {
  emit("remove", props.model.id);
};
</script>

<template>
  <div class="model-item">
    <div class="model-header">
      <input
        type="text"
        v-model="model.name"
        placeholder="Model Name"
        class="model-name-input"
      />
      <button v-if="armyState.freeEdit" @click="handleRemove" class="remove-btn" title="Remove Model">
        ✕
      </button>
    </div>

    <div class="model-details">
      <div class="field" v-if="model.class !== 'Vehicle'">
        <label>Lifeform</label>
        <div class="readonly-text">{{ model.lifeform }}</div>
      </div>
      <div class="field">
        <label>Class</label>
        <template v-if="armyState.freeEdit">
          <select :value="model.class" @change="(e) => updateModelClass(unitId, model.id, (e.target as HTMLSelectElement).value as ModelClass)" class="inline-select">
            <option v-for="cls in modelClasses" :key="cls" :value="cls">{{ cls }}</option>
          </select>
          <input type="number" :value="model.basePoints" @input="(e) => updateModelBasePoints(unitId, model.id, parseInt((e.target as HTMLInputElement).value) || undefined)" class="mini-pts-input" placeholder="Base Points" />
        </template>
        <div v-else class="readonly-text">
          {{ model.class }}
          <span class="point-badge" v-if="model.basePoints === undefined">[{{ lifeformClassPoints[model.lifeform]?.[model.class] || 0 }}]</span>
          <span class="point-badge" v-else>[{{ model.basePoints }}]</span>
        </div>
      </div>
      <div class="field points-field">
        <label>Points</label>
        <div class="readonly-text">{{ calculateModelPoints(model) }}</div>
      </div>
    </div>

    <div class="model-options-container">
      <label>Equipment</label>
      <EquipmentManager
        :target="model"
        @add-slot="(name, weapon) => addSlotToModel(unitId, model.id, name, weapon)"
        @remove-slot="(name) => removeSlotFromModel(unitId, model.id, name)"
        @add-extra="(item) => addExtraToModel(unitId, model.id, item)"
        @remove-extra="(index) => removeExtraFromModel(unitId, model.id, index)"
      />
    </div>
  </div>
</template>

<style scoped>
.model-item {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fafafa;
}

@media (prefers-color-scheme: dark) {
  .model-item {
    border-color: #444;
    background-color: #2a2a2a;
  }
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.model-name-input {
  font-weight: 600;
  font-size: 1.1em;
  border: none;
  background: transparent;
  width: 100%;
}
.model-name-input:focus {
  outline: none;
  border-bottom: 1px solid #4caf50;
}

.model-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

@media (min-width: 600px) {
  .model-details {
    grid-template-columns: 1fr 1fr 100px;
    gap: 1rem;
  }
}

.field {
  display: flex;
  flex-direction: column;
}

.field label,
.model-options label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.2rem;
}

@media (prefers-color-scheme: dark) {
  .field label,
  .model-options label {
    color: #aaa;
  }
}

.readonly-text {
  padding: 0.4rem 0;
  color: #777;
  font-weight: 500;
}

@media (prefers-color-scheme: dark) {
  .readonly-text {
    color: #999;
  }
}

input {
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

@media (prefers-color-scheme: dark) {
  input {
    background-color: #333;
    border-color: #555;
    color: white;
  }
}

.model-options {
  display: flex;
  flex-direction: column;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #ff5252;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 0.5rem;
}
.remove-btn:hover {
  font-weight: bold;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
}

.equipment-list {
  background-color: transparent;
}

.slot-label {
  min-width: 4rem;
  font-size: 0.8rem;
  color: #999;
  text-transform: capitalize;
}

@media (prefers-color-scheme: dark) {
  .slot-label {
    color: #666;
  }
}

.point-badge {
  font-size: 0.8rem;
  color: #4caf50;
  margin-left: 0.2rem;
  font-weight: bold;
}

.mini-select {
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.85rem;
  flex: 1;
}

.mini-remove-btn {
  background: #ff5252;
  color: white;
  border: none;
  border-radius: 4px;
  width: 1.1rem;
  height: 1.1rem;
  line-height: 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inline-select {
  padding: 0.2rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.mini-pts-input {
  padding: 0.2rem;
  width: 60px;
  font-size: 0.9rem;
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
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .mini-select, .inline-select, .mini-pts-input {
    background-color: #333;
    color: white;
    border-color: #555;
  }
}
</style>
