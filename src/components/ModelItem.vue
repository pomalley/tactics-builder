<script setup lang="ts">

import type { Model } from "../types";
import { calculateModelPoints } from "../store";
import { weaponPoints, lifeformClassPoints } from "../data";
import { formatSlotName } from "../utils";

const props = defineProps<{
  model: Model;
  unitId: string;
}>();

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
      <button @click="handleRemove" class="remove-btn" title="Remove Model">
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
        <div class="readonly-text">
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

    <div class="model-options" v-if="Object.keys(model.slots).length > 0 || model.extras.length > 0">
      <label>Equipment</label>
      <div class="readonly-options">
        <div
          v-for="(weapon, slotName) in model.slots"
          :key="slotName"
          class="option-row"
        >
          <div class="readonly-text slot-name">
            {{ formatSlotName(slotName as string) }}:
          </div>
          <div class="readonly-text">
            {{ weapon }}
            <span class="point-badge">[{{ weaponPoints[weapon] || 0 }}]</span>
          </div>
        </div>
        <div
          v-for="(item, index) in model.extras"
          :key="'extra-' + index"
          class="option-row"
        >
          <div class="readonly-text slot-name">+</div>
          <div class="readonly-text">
            {{ item }}
            <span class="point-badge">[{{ weaponPoints[item] || 0 }}]</span>
          </div>
        </div>
      </div>
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
  grid-template-columns: 1fr 1fr 100px;
  gap: 1rem;
  margin-bottom: 0.5rem;
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

.readonly-options {
  background-color: transparent;
}

.slot-name {
  min-width: 4rem;
  font-size: 0.8rem;
  color: #999;
  text-transform: capitalize;
}

.point-badge {
  font-size: 0.8rem;
  color: #4caf50;
  margin-left: 0.2rem;
  font-weight: bold;
}

@media (prefers-color-scheme: dark) {
  .slot-name {
    color: #666;
  }
}
</style>
