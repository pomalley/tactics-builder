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
  <div class="model-item card alt-bg">
    <div class="model-header">
      <input
        type="text"
        v-model="model.name"
        placeholder="Model Name"
        class="model-name-input"
      />
      <button v-if="armyState.freeEdit" @click="handleRemove" class="btn btn-ghost btn-mini remove-btn" title="Remove Model">
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
          <span class="point-badge points-text" v-if="model.basePoints === undefined">[{{ lifeformClassPoints[model.lifeform]?.[model.class] || 0 }}]</span>
          <span class="point-badge points-text" v-else>[{{ model.basePoints }}]</span>
        </div>
      </div>
      <div class="field points-field">
        <label>Points</label>
        <div class="readonly-text points-text">{{ calculateModelPoints(model) }}</div>
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
  margin-bottom: var(--space-sm);
}

.alt-bg {
  background-color: var(--bg-card-alt);
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
}

.model-name-input {
  font-weight: 600;
  font-size: 1.1em;
  border: none;
  background: transparent;
  width: 100%;
  color: var(--text-main);
}
.model-name-input:focus {
  outline: none;
  border-bottom: 1px solid var(--primary);
}

.model-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

@media (min-width: 600px) {
  .model-details {
    grid-template-columns: 1fr 1fr 100px;
    gap: var(--space-md);
  }
}

.field {
  display: flex;
  flex-direction: column;
}

.field label,
.model-options label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.readonly-text {
  padding: var(--space-xs) 0;
  font-weight: 500;
}

.model-options {
  display: flex;
  flex-direction: column;
}

.point-badge {
  font-size: 0.8rem;
  margin-left: var(--space-xs);
}

.mini-pts-input {
  width: 60px;
}
</style>
